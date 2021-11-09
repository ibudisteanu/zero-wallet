<template>
    <wait-account :account="account">
        <wizard :titles="{ ...titlesOffset,
                0: {icon: 'fas fa-pencil-alt', name: 'Extra Info', tooltip: 'Extra information attached in the tx' },
                1: {icon: 'fas fa-dollar-sign', name: 'Fee', tooltip: 'Setting the fee' }}"
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
                <tx-fee :balances="balancesStakeAvailable" :allow-zero="true" @changed="changedFee" />
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

export default {
    components: {AlertBox, ExtraData, Wizard, TxFee, WaitAccount},

    data(){
        return {
            fee: {},
            extraData: { },

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
            const amount = (this.account && this.account.plainAccount && this.account.plainAccount.delegatedStake) ? this.account.plainAccount.delegatedStake.stakeAvailable : 0
            return { [PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX]: {amount, asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX } }
        },
        getAsset(){
            return this.$store.getters.getAsset( this.asset ? this.asset.asset : null );
        },
        buttons(){
            return {
                1: { icon: 'fa fa-credit-card', text: 'Sign Transaction' },
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
                }else
                    return this.$emit('onSetTab', {resolve, reject, oldTab, value} )

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

            const fees = (this.fee.feeType === 'feeAuto') ? 0 : Number.parseInt( await PandoraPay.config.assets.assetsConvertToUnits( this.fee.feeManual.amount.toString(), this.getAsset.decimalSeparator ) )

            const data = {
                from: this.address.addressEncoded,
                nonce: 0,
                data: {
                    data: Buffer.from(this.extraData.data).toString("hex"),
                    encrypt: this.extraData.type === "encrypted",
                    publicKeyToEncrypt: this.extraData.publicKeyToEncrypt,
                },
                fee: {
                    fixed:  fees,
                    perByte: 0,
                    perByteAuto: this.fee.feeType === 'feeAuto',
                },
                propagateTx: true,
                awaitAnswer: false,
            }

            if (this.beforeProcess)
                await this.beforeProcess(password, data)

            const out = await PandoraPay.transactions.builder.createSimpleTx( MyTextEncode( JSON.stringify(data) ), (status) => {
                this.status = status
            }, password);

            if (!out) throw "Transaction couldn't be made";
            this.status = ''

            const tx = JSON.parse( MyTextDecode(out) )

            await this.$store.dispatch('includeTx', {tx, mempool: false } )

            this.$router.push(`/explorer/tx/${tx.hash}`);

            this.$emit('onFinished', true )
        }

    },

}
</script>