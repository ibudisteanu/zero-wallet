<template>

    <layout>

        <layout-title icon="fa-money-check-alt" title="Send Privately Funds">Transfer privately funds from your account.</layout-title>

        <template v-if="address">

            <alert-box v-if="!isLoading && !isFound" type="warning" >
                Address doesn't exist (is empty)!
            </alert-box>
            <template v-else>
                <div class="card theme-wizard my-5">
                    <div class="card-header bg-light py-3">
                        <ul class="nav justify-content-between nav-wizard">
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===0?'active':''} fw-semi-bold`" >
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-users"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Receiver</span>
                                </span>
                            </li>
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===1?'active':''} fw-semi-bold`">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-eye-slash"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Privacy</span>
                                </span>
                            </li>
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===2?'active':''}  fw-semi-bold`" >
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-dollar-sign"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Fee</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body py-3">
                        <div class="tab-content">
                            <div :class="`tab-pane ${tab===0?'active':''} `">

                                <tx-token :tokens="availableTokens" @changed="changedToken" class="pb-4" />

                                <destination-address :accounts="availableAccounts"
                                                     :token="token.token"
                                                     @changed="changedDestination">
                                </destination-address>

                                <alert-box v-if="checkDestinationError" class="w-100" type="error">{{checkDestinationError}}</alert-box>

                                <extra-data :destinations="[destination]" class="pt-4"
                                            :paymentId="identifiedPaymentID"
                                            @changed="changedExtraData" />

                            </div>
                            <div :class="`tab-pane ${tab===1?'active':''} `">

                            </div>
                            <div :class="`tab-pane ${tab===2?'active':''} `">
                                <tx-fee :accounts="availableAccounts" :token="token" :allow-zero="true" @changed="changedFee" />
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-light">

                        <alert-box v-if="error" class="w-100" type="error">{{error}}</alert-box>

                        <label v-if="status">{{status}}</label>

                        <div class="float-end">
                            <loading-button v-if="tab > 0" text="Back" @submit="handleBack" icon="fas fa-chevron-left ms-2" classCustom="btn btn-link" :iconLeft="false" />
                            <loading-button :text="`${tab === maxTab ? 'Delegate' : 'Next'}`" @submit="handleNext" :icon="`${ tab === maxTab ? 'fa fa-credit-card' : 'fas fa-chevron-right ms-2' }`"  />
                        </div>
                    </div>
                </div>

            </template>

        </template>
        <div class="py-3 text-center" v-else>
            <loading-spinner class="fs-3" />
        </div>


    </layout>
</template>

<script>

const {version} = PandoraPay.enums.wallet.address;

import Layout from "src/components/layout/layout"
import Account from "src/components/wallet/account/account"
import LoadingSpinner from "src/components/utils/loading-spinner";
import LoadingButton from "src/components/utils/loading-button"
import DestinationAddress from "src/components/send/destination-address"
import TxAmount from "src/components/send/tx-amount"
import TxToken from "src/components/send/tx-token"
import TxFee from "src/components/send/tx-fee"
import ExtraData from "src/components/send/extra-data"
import Vue from 'vue'
import AlertBox from "src/components/utils/alert-box"
import LayoutTitle from "src/components/layout/layout-title";

export default {

    components: { LayoutTitle, Layout, Account, LoadingSpinner, LoadingButton, DestinationAddress, TxAmount,
        ExtraData, AlertBox, TxFee, TxToken,
    },

    data(){
        return {
            tab: 0,
            maxTab: 3,

            token: { }, //contains token.token and token.validation
            destination: {},
            fee: {  },

            extraData: {
                data: "",
                type: "public",
                publicKeyToEncrypt: "",
                validationError: null,
            },

            error: '',
            status: '',
        }
    },

    computed:{

        version: () => version,
        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey] ;
        },
        account(){
            return this.$store.state.accounts.list[this.$store.state.wallet.mainPublicKey]
        },
        availableTokens(){
            if (this.account && this.account.tokens ) return this.account.tokens;
            return null
        },
        availableAccounts(){
            if (this.account && this.account.accounts ) return this.account.accounts;
            return null
        },
        isLoading(){
            return this.account === undefined
        },
        isFound(){
            return this.account !== null
        },

        checkDestinationError(){

            try{

                if (this.destination.address)
                    if (this.destination.publicKey === this.address.publicKey) throw "Destination can not be the same with from";

            }catch (err){
                return err.toString()
            }

        },

        identifiedPaymentID(){
            if (this.destination.address) {
                if (this.destination.address.paymentId)
                    return this.destination.address.paymentId
            }
        },

    },

    methods:{

        async setTab(resolver, value){
            try{

                value = Math.max( value, 0)
                value = Math.min( value, this.maxTab + 1)

                if (this.tab === 0 && value === 1){
                    if (this.token.validationError) throw this.token.validationError
                    if (this.checkDestinationError) throw this.checkDestinationError
                    if (this.destination.validationError) throw this.destination.validationError;
                }
                if (this.tab === 1 && value === 2){
                    if (this.extraData.validationError) throw this.extraData.validationError
                }
                if (this.tab === 2 && value === 3){
                    if (this.fee.feeAuto.validationError) throw this.fee.feeAuto.validationError
                    if (this.fee.feeManual.validationError) throw this.fee.feeManual.validationError

                    await this.handleSendFunds()
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
        changedDestination(index, data){
            this.destination = {
                ...this.destination,
                ...data,
            }
        },
        changedToken(data){
            this.token = { ...this.token,  ...data, }
        },
        changedFee(data){
            this.fee = { ...this.fee,  ...data, }
        },
        changedExtraData(data){
            this.extraData = { ...this.extraData,  ...data, }
        },

        async handleSendFunds(){

            try{

                this.error = '';
                this.status = '';

                const amounts = { }

                for (const destination of this.destinations)
                    amounts.push = destination.amount

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                //compute extra
                const out = await PandoraPay.transactions.builder.createSimpleTx_Float( JSON.stringify({
                    from: [this.address.addressEncoded],
                    nonce: 0,
                    token: this.token.token,
                    amounts: Object.values(amounts),
                    dsts: this.destinations.map (it => it.addressEncoded),
                    dstsAmounts: this.destinations.map (it => it.amount),
                    fee: {
                        fixed: (this.fee.feeType === 'feeAuto') ? 0 : this.fee.feeManual.amount,
                        perByte: 0,
                        perByteAuto: this.fee.feeType === 'feeAuto',
                    },
                    data: {
                        data: Buffer.from(this.extraData.data).toString("hex"),
                        encrypt: this.extraData.type === "encrypted",
                        publicKeyToEncrypt: this.extraData.publicKeyToEncrypt,
                    },
                    propagateTx: true,
                    awaitAnswer: true,
                } ), (status) => {
                    this.status = status
                }, password );

                if (!out) throw "Transaction couldn't be made";
                this.status = ''

                const tx = JSON.parse( MyTextDecode( out) )

                await this.$store.dispatch('includeTx', { tx } )

                await this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Transaction created`,
                    text: `A transaction has been made. \n TxId ${tx.hash}`,
                });

                this.$router.push(`/explorer/tx/${tx.hash}`);

            }catch(err){
                console.error(err);
                this.error = err.message;
            }

        },


    },

    mounted(){
    }

}

</script>

<style scoped>
</style>
