<template>
    <div v-if="!isLoading && isFound" >
        <wizzard :titles="[
                ...titlesOffset,
                {icon: 'fas fa-pencil-alt', name: 'Extra Info', tooltip: 'Extra information attached in the tx' },
                {icon: 'fas fa-dollar-sign', name: 'Fee', tooltip: 'Setting the fee' }]"
                 @onSetTab="setTab" controls-class-name="modal-footer bg-light" :buttons="buttons" >

            <template v-for="(_, index) in new Array(tabsOffset+1)">
                <template :slot="`tab_${index}`">
                    <slot :name="`tab_${index}`"></slot>
                </template>
            </template>

            <template :slot="`tab_${tabsOffset}`">
                <extra-data @changed="changedExtraData" />
            </template>

            <template :slot="`tab_${tabsOffset+1}`">
                <tx-fee :balances="balancesStakeAvailable" :allow-zero="true" @changed="changedFee" :asset="''" />
            </template>

            <template slot="wizzard-footer">
                <template v-if="status">
                    <span class="d-block">Transaction is being created. It will take 1-2 minutes.</span>
                    <label class="d-block">Status: {{status}}</label>
                </template>
            </template>

        </wizzard>
    </div>
</template>

<script>
import AlertBox from "../../utils/alert-box";
import ExtraData from "../extra-data";
import Wizzard from "../../utils/wizzard";
import TxFee from "../tx-fee";
export default {
    components: {AlertBox, ExtraData, Wizzard, TxFee},

    data(){
        return {
            fee: {},
            extraData: { },

            status: '',
        }
    },

    props: {
        publicKey: {default: ""},
        tabsOffset: 0,
        titlesOffset: {default: () => []}, //{icon, name}
        txData: {default: ({}) },
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
        isLoading(){
            return this.account === undefined
        },
        isFound(){
            return this.account !== null
        },
        balancesStakeAvailable(){
            return (this.account && this.account.delegatedStake) ? [{ amount: this.account.delegatedStake.stakeAvailable, asset: ""}] : [{ amount: 0, asset: ""}]
        },
        buttons(){
            const obj = {
                ...this.buttonsOffset,
            }
            if (!obj[2+this.tabsOffset])
                obj[2+this.tabsOffset] = { icon: 'fa fa-credit-card', text: 'Sign Transaction' }

            return obj
        }
    },

    methods:{

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (value <= this.tabsOffset)
                    return this.$emit('onSetTab', {resolve, reject, oldTab, value} )

                if (oldTab === this.tabsOffset && value === this.tabsOffset+1)
                    if (this.extraData.validationError) throw this.extraData.validationError

                if (oldTab === this.tabsOffset+1 && value === this.tabsOffset+2){
                    if (this.fee.feeAuto.validationError) throw this.fee.feeAuto.validationError
                    if (this.fee.feeManual.validationError) throw this.fee.feeManual.validationError

                    await this.handeTxProcess()
                }

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