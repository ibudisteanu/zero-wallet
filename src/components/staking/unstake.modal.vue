<template>

    <modal ref="modal" title="Unstake" content-class="">

        <template slot="body">

            <alert-box v-if="!isLoading && !isFound" type="warning" >
                Address doesn't exist (is empty)!
            </alert-box>
            <template v-else>

                <div class="card theme-wizard">
                    <div class="card-header bg-light py-3">
                        <ul class="nav justify-content-between nav-wizard">
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===0?'active':''} fw-semi-bold`">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-users"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Amount</span>
                                </span>
                            </li>
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===1?'active':''} fw-semi-bold`">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-pen"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Extra Info</span>
                                </span>
                            </li>
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===2?'active':''} fw-semi-bold`">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-dollar-sign"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Fee</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body py-3">
                        <div class="tab-content">
                            <div :class="`tab-pane ${tab===0?'active':''} `">
                                <tx-amount :allow-zero="true" :allow-token="false" :balances="balancesStakeAvailable" @changed="amountChanged" text="Amount to unstake" />
                            </div>
                            <div :class="`tab-pane ${tab===1?'active':''} `">
                                <extra-data :version="version.VERSION_TRANSPARENT" @changed="changedExtraData" />
                            </div>
                            <div :class="`tab-pane ${tab===2?'active':''} `">
                                <tx-fee :balances="balances" :allow-zero="true" @changed="changedFee" />
                            </div>
                        </div>
                    </div>
                </div>

            </template>

        </template>
        <template slot="footer">

            <alert-box v-if="error" class="w-100" type="error">{{error}}</alert-box>

            <div v-if="status" class="py-2">
                <label>{{status}}</label>
            </div>

            <div class="float-end">
                <loading-button v-if="tab > 0" text="Back" @submit="handleBack" icon="fas fa-chevron-left ms-2" classCustom="btn btn-link" :iconLeft="false" />
                <loading-button :text="`${tab === maxTab ? 'Unstake' : 'Next'}`" @submit="handleNext" :icon="`${ tab === maxTab ? 'fa fa-unlink' : 'fas fa-chevron-right ms-2' }`"  />
            </div>

        </template>

    </modal>

</template>

<script>
import TxFee from "../send/tx-fee";
const {version} = PandoraPay.enums.wallet.address;
import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import AlertBox from "src/components/utils/alert-box"
import TxAmount from "src/components/send/tx-amount"
import ExtraData from "src/components/send/extra-data"

export default {

    components: {TxFee, Modal, PasswordInput, LoadingButton, AlertBox, ExtraData, TxAmount},


    data(){
        return {

            publicKey: "",

            tab: 0,
            maxTab: 2,

            unstakeAmount: 0,

            fee: {},
            extraData: { },

            error: '',
            status: '',
        }
    },

    props:{
    },

    computed:{
        version: () => version,
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
        balances(){
            return this.account ? this.account.balances : [];
        },
        balancesStakeAvailable(){
            return (this.account && this.account.delegatedStake) ? [{ amount: this.account.delegatedStake.stakeAvailable, token: ""}] : [{ amount: 0, token: ""}]
        },
    },

    methods:{

        async setTab(resolver, value){
            try{

                value = Math.max( value, 0)
                value = Math.min( value, this.maxTab + 1)

                if (this.tab === 1 && value === 2){
                    if (this.extraData.validationError) throw this.extraData.validationError
                }
                if (this.tab === 2 && value === 3){
                    if (this.fee.feeAuto.validationError) throw this.fee.feeAuto.validationError
                    if (this.fee.feeManual.validationError) throw this.fee.feeManual.validationError

                    await this.handleUnstake()
                }

                this.tab = value
            }catch(err) {
                console.error(err)
            }finally{
                resolver()
            }
        },

        handleBack(resolver){
            return this.setTab(resolver, this.tab - 1)
        },
        handleNext(resolver){
            return this.setTab(resolver, this.tab + 1)
        },

        amountChanged(data){
            if (data.amount !== undefined) this.unstakeAmount = data.amount
        },

        changedFeeManual(data){
            this.feeManual = { ...this.feeManual,  ...data, }
        },
        changedFeeAuto(data){
            this.feeAuto = { ...this.feeAuto,  ...data, }
        },
        changedExtraData(data){
            this.extraData = { ...this.extraData,  ...data, }
        },
        changedFee(data){
            this.fee = { ...this.fee, ...data }
        },

        showModal( publicKe ) {
            Object.assign(this.$data, this.$options.data());
            this.publicKey = publicKey;
            return this.$refs.modal.showModal();
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        async handleUnstake(){

            try {

                this.error = '';
                this.status = '';

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                const out = await PandoraPay.transactions.builder.createUnstakeTx_Float( JSON.stringify({
                    from: this.address.addressEncoded,
                    nonce: 0,
                    unstakeAmount: this.unstakeAmount,
                    data: {
                        data: Buffer.from(this.extraData.data).toString("hex"),
                        encrypt: this.extraData.type === "encrypted",
                        publicKeyToEncrypt: this.extraData.publicKeyToEncrypt,
                    },
                    fee: {
                        fixed: (this.fee.feeType === 'feeAuto') ? 0 : this.fee.feeManual.amount,
                        perByte: 0,
                        perByteAuto: this.fee.feeType === 'feeAuto',
                        token: this.fee.feeType === 'feeAuto' ? this.fee.feeAuto.token : this.fee.feeManual.token,
                    },
                    propagateTx: true,
                    awaitAnswer: true,
                }), (status) => {
                    this.status = status
                }, password);

                if (!out) throw "Transaction couldn't be made";
                this.status = ''

                const tx = JSON.parse(out)

                await this.$store.dispatch('includeTx', {tx } )

                await this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Unstake Transaction created`,
                    text: `Unstake Transaction has been made. \n TxId ${tx.hash}`,
                });

                this.$router.push(`/explorer/tx/${tx.hash}`);

                this.closeModal();

            }catch(err){
                this.error = err.message;
            }
        }

    },

}
</script>

<style scoped>

</style>
