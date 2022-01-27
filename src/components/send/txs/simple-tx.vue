<template>
    <wait-account :account="account" type="transparent">
        <wizard :titles="{ ...titlesOffset,
                0: {icon: 'fas fa-pencil-alt', name: 'Extra Info', tooltip: 'Extra information attached in the tx' },
                1: {icon: 'fas fa-dollar-sign', name: 'Fee', tooltip: 'Setting the fee' },
                2: {icon: 'fas fa-search-dollar', name: 'Preview', tooltip: 'Preview the transaction before Propagating' } }"
                 @onSetTab="setTab" :buttons="buttons" controls-class-name="card-footer bg-light" class="card" >

            <template v-for="(_, index) in titlesOffset">
                <template :slot="`tab_${index}`">
                    <slot :name="`tab_${index}`"></slot>
                </template>
            </template>

            <template :slot="`tab_0`">
                <extra-data @changed="changedExtraData" />
            </template>

            <template :slot="`tab_1`">

                <div class="form pb-2">
                    <input class="form-check-input" id="fee-version" type="checkbox"  name="checkbox" v-model="feeVersion">
                    <label class="form-check-label" for="fee-version">Pay fee Unclaimed balance</label>
                    <i class="fas fa-question " v-tooltip.bottom="`Subtract the fee from the unclaimed balance or from the delegated stake.`" />
                </div>

                <tx-fee :balances="balancesStakeAvailable" :allow-zero="true" @changed="changedFee" />
            </template>

            <template :slot="`tab_2`">
                <confirm-broadcasting-tx v-if="tx" class="my-3 fs--1" :tx="tx" />
            </template>

            <template slot="wizard-footer">
                <template v-if="status">
                    <span class="d-block">Transaction is being created. It will take 1-2 minutes.</span>
                    <label class="d-block">Status: {{status}}</label>
                </template>
            </template>

        </wizard>
    </wait-account>
</template>

<script>
import AlertBox from "../../utils/alert-box";
import ExtraData from "../extra-data";
import Wizard from "../../utils/wizard";
import TxFee from "../tx-fee";
import WaitAccount from "src/components/wallet/account/wait-account";
import ConfirmBroadcastingTx from "./confirm-broadcasting-tx"
import Decimal from "decimal.js"

export default {
    components: {AlertBox, ExtraData, Wizard, TxFee, WaitAccount, ConfirmBroadcastingTx},

    data(){
        return {
            fee: {},
            feeVersion: false,

            extraData: { },

            tx: null,
            txSerialized: null,

            status: '',
        }
    },

    props: {
        publicKey: {default: ""},
        titlesOffset: {default: () => ({}) }, //{icon, name}
        buttonsOffset: {default: () => ({}) },
        beforeProcess: {default: null}, //function
    },

    computed:{
        address(){
            return this.$store.state.wallet.addresses[this.publicKey];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        balancesStakeAvailable(){
            const amount = (this.account && this.account.plainAccount && this.account.plainAccount.delegatedStake) ? this.account.plainAccount.delegatedStake.stakeAvailable : new Decimal(0)
            return { [PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX]: {amount, asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX } }
        },
        getAsset(){
            return this.$store.getters.getAsset( this.asset ? this.asset.asset : null );
        },
        buttons(){
            return {
                1: { icon: 'fas fa-file-signature', text: 'Sign Transaction' },
                2: { icon: 'fas fa-globe-americas', text: 'Propagate Transaction' },
                ...this.buttonsOffset,
            }
        }
    },

    methods:{

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === 0 && value > oldTab) {
                    if (this.extraData.validationError) throw this.extraData.validationError
                }else if (oldTab === 1 && value > oldTab){
                    if (this.fee.feeAuto.validationError) throw this.fee.feeAuto.validationError
                    if (this.fee.feeManual.validationError) throw this.fee.feeManual.validationError

                    await this.handeTxProcess()
                }else if (oldTab === 2 && value > oldTab) {
                    await this.handlePropagateTx()
                }else return this.$emit('onSetTab', {resolve, reject, oldTab, value} )

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },

        changedExtraData(data){
            this.extraData = { ...this.extraData,  ...data, }
        },
        changedFee(data){
            this.fee = { ...this.fee, ...data }
        },

        async handeTxProcess(){

            this.status = '';

            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            const fee = this.fee.feeType ? new Decimal(0) : this.fee.feeManual.amount

            const nonceOut = await PandoraPay.network.getNetworkAccountMempoolNonce(MyTextEncode(JSONStringify({ publicKey: this.address.publicKey })))

            const nonce = JSONParse( MyTextDecode(nonceOut)).nonce

            const data = {
                from: this.address.addressEncoded,
                nonce: nonce.toString(),
                data: {
                    data: Buffer.from(this.extraData.data).toString("hex"),
                    encrypt: this.extraData.type === "encrypted",
                    publicKeyToEncrypt: this.extraData.publicKeyToEncrypt,
                },
                fee: {
                    fixed:  fee,
                    perByte: new Decimal(0),
                    perByteExtraSpace: new Decimal(0),
                    perByteAuto: this.fee.feeType,
                },
                feeVersion: this.feeVersion,
                height: this.$store.state.blockchain.end,
            }

            if (this.beforeProcess)
                await this.beforeProcess(password, data)

            const out = await PandoraPay.transactions.builder.createSimpleTx( MyTextEncode( JSONStringify(data) ),
                status => {
                    this.status = status
                }, password);

            if (!out) throw "Transaction couldn't be made";
            this.status = ''

            this.tx = JSONParse( MyTextDecode( out[0] ) )
            this.txSerialized = out[1]

        },

        async handlePropagateTx(){
            this.status = 'Cloning transaction...'

            const txSerialized = Buffer.alloc(this.txSerialized.length)
            Buffer.from(this.txSerialized).copy(txSerialized, 0)

            this.status = 'Propagating transaction...'

            await this.$store.dispatch('includeTx', {tx: this.tx, mempool: false } )

            const finalAnswer = await PandoraPay.network.postNetworkMempoolBroadcastTransaction( txSerialized )
            if (!finalAnswer) {
                this.$store.commit('deleteTransactions', [this.tx] )
                throw "Transaction couldn't be broadcast"
            }

            this.$router.push(`/explorer/tx/${this.tx.hash}`);

            this.$emit('onFinished', true )
        }

    },

}
</script>