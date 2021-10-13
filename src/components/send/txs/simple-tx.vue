<template>
    <wait-account :address="address" :account="account">
        <wizzard :titles="{ ...titlesOffset,
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
                <tx-fee :balances="balancesStakeAvailable" :allow-zero="true" @changed="changedFee" :asset="''" />
            </template>

            <template slot="wizzard-footer">
                <template v-if="status">
                    <span class="d-block">Transaction is being created. It will take 1-2 minutes.</span>
                    <label class="d-block">Status: {{status}}</label>
                </template>
            </template>

        </wizzard>
    </wait-account>
</template>

<script>
import AlertBox from "../../utils/alert-box";
import ExtraData from "../extra-data";
import Wizzard from "../../utils/wizzard";
import TxFee from "../tx-fee";
import WaitAccount from "src/components/wallet/account/wait-account";

export default {
    components: {AlertBox, ExtraData, Wizzard, TxFee, WaitAccount},

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
        txData: {default: () => ({}) },
        buttonsOffset: {default: () => ({}) },
        txName: {default: ""},
    },

    computed:{
        address(){
            return this.$store.state.wallet.addresses[this.publicKey];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        balancesStakeAvailable(){
            return (this.account && this.account.delegatedStake) ? [{ amount: this.account.delegatedStake.stakeAvailable, asset: ""}] : [{ amount: 0, asset: ""}]
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

            const out = await PandoraPay.transactions.builder[this.txName]( JSON.stringify({
                from: this.address.addressEncoded,
                ...this.txData,
                nonce: 0,
                data: {
                    data: Buffer.from(this.extraData.data).toString("hex"),
                    encrypt: this.extraData.type === "encrypted",
                    publicKeyToEncrypt: this.extraData.publicKeyToEncrypt,
                },
                fee: {
                    fixed: (this.fee.feeType === 'feeAuto') ? 0 : this.fee.feeManual.amount,
                    perByte: 0,
                    perByteAuto: this.fee.feeType === 'feeAuto',
                },
                propagateTx: true,
                awaitAnswer: false,
            }), (status) => {
                this.status = status
            }, password);

            if (!out) throw "Transaction couldn't be made";
            this.status = ''

            const tx = JSON.parse( MyTextDecode(out) )

            await this.$store.dispatch('includeTx', {tx } )

            await this.$store.dispatch('addToast', {
                type: 'success',
                title: `A Transaction created`,
                text: `A Transaction has been made. \n TxId ${tx.hash}`,
            });

            this.$router.push(`/explorer/tx/${tx.hash}`);

            this.$emit('onFinished', true )
        }

    },

}
</script>