<template>

    <layout>

        <layout-title icon="fa-money-check-alt" title="Send Transparent Funds">Transfer funds transparently from your account.</layout-title>

        <template v-if="address">

            <alert-box v-if="!isLoading && !isFound" type="warning" >
                Address doesn't exist!
            </alert-box>
            <template v-else>

                <div class="card theme-wizard my-5">
                    <div class="card-header bg-light py-3">
                        <ul class="nav justify-content-between nav-wizard">
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===0?'active':''} fw-semi-bold`" >
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-users"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Receivers</span>
                                </span>
                            </li>
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===1?'active':''} fw-semi-bold`">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-pen"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Extra Info</span>
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

                                <destination-address v-for="(destination, index) in destinations"
                                                     :key="`destinationAddress-${index}`"
                                                     :class="`${index > 0 ? 'pt-5' : '0'}`"
                                                     :index="index"
                                                     :version="version.VERSION_TRANSPARENT"
                                                     :balances="balances"
                                                     @changed="e => changedDestination(index, e)"
                                                     @deleted="e => deletedDestination(index, e)">
                                </destination-address>

                                <div class="text-center py-3">
                                    <button class="btn btn-falcon-primary rounded-pill me-1" type="button" @click="addDestination" v-tooltip.bottom="'Add another address'" >
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </div>

                                <alert-box v-if="checkDestinationError" class="w-100" type="error">{{checkDestinationError}}</alert-box>

                            </div>
                            <div :class="`tab-pane ${tab===1?'active':''} `">
                                <extra-data :destinations="destinations"
                                            :version="version.VERSION_TRANSPARENT"
                                            :paymentId="identifiedPaymentID"
                                            @changed="changedExtraData" />
                            </div>
                            <div :class="`tab-pane ${tab===2?'active':''} `">

                                <div class="form-check">
                                    <input class="form-check-input" id="feeAuto" type="radio" value="feeAuto" v-model="feeType" />
                                    <label class="form-check-label" for="feeAuto">Auto fee</label>
                                </div>
                                <tx-amount class="pb-4" v-if="feeType === 'feeAuto'" text="Fee Amount" :balances="balances" @changed="changedFeeAuto" :allow-zero="true" :allow-amount="false" />

                                <div class="form-check">
                                    <input class="form-check-input" id="feeManual" type="radio" value="feeManual" v-model="feeType" />
                                    <label class="form-check-label" for="feeManual">Manual fee</label>
                                </div>
                                <tx-amount v-if="feeType === 'feeManual'" text="Fee Amount" :balances="balances" @changed="changedFeeManual" :allow-zero="true" />
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-light">

                        <alert-box v-if="error" class="w-100" type="error">{{error}}</alert-box>

                        <label v-if="status">{{status}}</label>

                        <div class="float-end">
                            <button class="btn btn-link" type="button" v-if="tab > 0" @click="handleBack">
                                Back <i class="fas fa-chevron-left me-2"></i>
                            </button>
                            <button class="btn btn-falcon-primary" type="button" v-if="tab < 2" @click="handleNext">
                                <i class="fas fa-chevron-right ms-2"> </i> Next
                            </button>
                            <loading-button v-if="tab===2" text="Send funds" @submit="handleSendFunds" icon="fa fa-credit-card"  />
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
import LoadingButton from "src/components/utils/loading-button.vue"
import DestinationAddress from "src/components/send/destination-address.vue"
import TxAmount from "src/components/send/tx-amount.vue"
import ExtraData from "src/components/send/extra-data"
import Vue from 'vue'
import AlertBox from "src/components/utils/alert-box"
import LayoutTitle from "src/components/layout/layout-title";

export default {

    components: { LayoutTitle, Layout, Account, LoadingSpinner, LoadingButton, DestinationAddress, TxAmount,
        ExtraData, AlertBox
    },

    data(){
        return {
            tab: 0,

            destinations: [],

            feeType: "feeAuto",
            feeAuto: {
                amount: 0,
                token: "",
            },
            feeManual: {
                amount: 0,
                token: "",
            },

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
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKeyHash] ;
        },
        account(){
            return this.$store.state.accounts.list[this.$store.state.wallet.mainPublicKeyHash]
        },
        balances(){
            if (this.account) return this.account.balances;
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

                const PaymentIDs = []

                for (const destination of this.destinations)
                    if (destination.address) {
                        if (destination.addressEncoded === this.address.addressEncoded) throw "Destination can not be the same with from";
                        if (destination.address.paymentId)
                            PaymentIDs.push(destination.address.paymentId)
                    }

                if (PaymentIDs.length > 1)
                    throw "Multiple PaymentIDs are not allowed"

            }catch (err){
                return err.toString()
            }

        },

        identifiedPaymentID(){
            for (const destination of this.destinations)
                if (destination.address) {
                    if (destination.address.paymentId)
                        return destination.address.paymentId
                }
        },

    },

    methods:{

        increaseTab(value){
            this.setTab(this.tab + value)
        },
        setTab(value){
            try{

                value = Math.max( value, 0)
                value = Math.min( value, 2)

                if (this.tab === 0 && value === 1){

                    if (this.checkDestinationError) throw this.checkDestinationError

                    for (const destination of this.destinations)
                        if (destination.validationError) throw destination.validationError;

                }
                if (this.tab === 1 && value === 2){
                    if (this.extraData.validationError) throw this.extraData.validationError
                }

            }catch(err){
                return
            }
            this.tab = value
        },

        handleBack(){
            return this.increaseTab(-1)
        },

        handleNext(){
            return this.increaseTab(1)
        },

        addDestination(){
            this.destinations.push({
                address: null,
                validationError: 'Address is empty',
                amount: 0,
                token: '',
            });
        },

        changedDestination(index, data){
            Vue.set(this.destinations, index, {
                ...this.destinations[index],
                ...data
            });
        },

        deletedDestination(index, data){
            Vue.delete(this.destinations, index )
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

        async handleSendFunds(resolve){

            try{

                this.error = '';
                this.status = '';

                const amounts = { }

                for (const destination of this.destinations)
                    amounts[destination.token] = (amounts[destination.token] || 0) + destination.amount

                if (this.feeAuto.validationError) throw this.feeAuto.validationError
                if (this.feeManual.validationError) throw this.feeManual.validationError

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                //compute extra
                const out = await PandoraPay.transactions.builder.createSimpleTx_Float( JSON.stringify({
                    from: [this.address.addressEncoded],
                    nonce: 0,
                    amounts: Object.values(amounts),
                    amountsTokens: Object.keys(amounts),
                    dsts: this.destinations.map (it => it.addressEncoded),
                    dstsAmounts: this.destinations.map (it => it.amount),
                    dstsTokens: this.destinations.map (it => it.token),
                    fee: {
                        fixed: (this.feeType === 'feeAuto') ? 0 : this.feeManual.amount,
                        perByte: 0,
                        perByteAuto: this.feeType === 'feeAuto',
                        token: this.feeType === 'feeAuto' ? this.feeAuto.token : this.feeManual.token,
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

                const tx = JSON.parse(out)

                await this.$store.dispatch('includeTx', { tx } )

                const hash = tx.hash;

                this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Transaction created`,
                    text: `A transaction has been made. \n TxId ${hash}`,
                });

                this.$router.push(`/explorer/tx/${hash}`);

            }catch(err){
                console.error(err);
                this.error = err.message;
            }finally{
                resolve(true);
            }

        },


    },

    mounted(){
        this.addDestination();
    }

}

</script>

<style scoped>
</style>
