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
                                <router-link :class="`nav-link ${tab===0?'active':''} fw-semi-bold`" to="#" @click.native="()=>setTab(0)">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-users"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Receivers</span>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :class="`nav-link ${tab===1?'active':''} fw-semi-bold`" to="#" @click.native="()=>setTab(1)">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-pen"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Extra Info</span>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :class="`nav-link ${tab===2?'active':''}  fw-semi-bold`" to="#" @click.native="()=> setTab(2)">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-dollar-sign"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Fee</span>
                                </router-link>
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
                                                     :type="version.VERSION_TRANSPARENT"
                                                     :balances="balances"
                                                     @changed="e => changedDestination(index, e)"
                                                     @deleted="e => deletedDestination(index, e)">
                                </destination-address>

                                <div class="text-center pt-3">
                                    <button class="btn btn-falcon-primary rounded-pill me-1 mb-1" type="button" @click="addDestination" v-tooltip.bottom="'Add another address'" >
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </div>

                            </div>
                            <div :class="`tab-pane ${tab===1?'active':''} `">
                                <!--                <extra-message :destinations="destinations"-->
                                <!--                               :type="version.VERSION_TRANSPARENT"-->
                                <!--                               @changed="changedExtra" />-->
                            </div>
                            <div :class="`tab-pane ${tab===2?'active':''} `">

                                <div class="form-check">
                                    <input class="form-check-input" id="feeAuto" type="radio" value="feeAuto" v-model="feeType" />
                                    <label class="form-check-label" for="feeAuto">Auto fee</label>
                                </div>
                                <destination-amount class="pb-4" v-if="feeType === 'feeAuto'" text="Fee Amount" :balances="balances" @changed="changedFeeAuto" :allow-zero="true" :allow-amount="false" />

                                <div class="form-check">
                                    <input class="form-check-input" id="feeManual" type="radio" value="feeManual" v-model="feeType" />
                                    <label class="form-check-label" for="feeManual">Manual fee</label>
                                </div>
                                <destination-amount v-if="feeType === 'feeManual'" text="Fee Amount" :balances="balances" @changed="changedFeeManual" :allow-zero="true" />
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
import DestinationAmount from "src/components/send/destination-amount.vue"
import ExtraMessage from "src/components/send/extra-message"
import Vue from 'vue'
import AlertBox from "src/components/utils/alert-box"
import LayoutTitle from "src/components/layout/layout-title";

export default {

    components: { LayoutTitle, Layout, Account, LoadingSpinner, LoadingButton, DestinationAddress, DestinationAmount,
        ExtraMessage, AlertBox
    },

    data(){
        return {
            tab: 0,

            destinations: [],

            feeType: "feeAuto",
            feeManualValue: 0,
            feeManualToken: '',

            feeAutoToken: '',

            extraMessage: '',
            extraEncryptionOption: '',

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
    },

    methods:{

        increaseTab(value){
            this.tab = this.tab + value
        },
        setTab(value){
            this.tab = value
        },

        handleBack(){
            return this.increaseTab(-1)
        },

        async handleNext(){
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
            if (data.amount !== undefined) this.feeManualValue = data.amount;
            if (data.token) this.feeManualToken = data.token;
        },

        changedFeeAuto(data){
            if (data.token) this.feeAutoToken = data.token;
        },

        changedExtra(data){
            if (data.extraMessage !== undefined) this.extraMessage = data.extraMessage;
            if (data.extraEncryptionOption) this.extraEncryptionOption = data.extraEncryptionOption;
        },

        async handleSendFunds(resolve){

            try{

                this.error = '';
                this.status = '';

                const amounts = {

                }

                for (const destination of this.destinations) {

                    if (destination.validationError) throw destination.validationError;
                    if (destination.address === this.address.encodedAddress) throw "Destination can not be the same with from";

                    if (!amounts[destination.token])
                        amounts[destination.token] = 0

                    amounts[destination.token] += destination.amount
                }

                //compute extra
                const out = await PandoraPay.transactions.builder.createSimpleTx_Float( JSON.stringify({
                    from: [this.address.addressEncoded],
                    nonce: 0,
                    amounts: Object.values(amounts),
                    amountsTokens: Object.keys(amounts),
                    dsts: this.destinations.map (it => it.encodedAddress),
                    dstsAmounts: this.destinations.map (it => it.amount),
                    dstsTokens: this.destinations.map (it => it.token),
                    feeFixed: (this.feeType === 'feeAuto') ? 0 : this.feeManualValue,
                    feePerByte: 0,
                    feePerByteAuto: this.feeType === 'feeAuto',
                    feeToken: this.feeType === 'feeAuto' ? this.feeAutoToken : this.feeManualToken,
                    propagateTx: true,
                    awaitAnswer: true,
                    // extra:{
                    //     extraMessage: this.extraMessage,
                    //     extraEncryptionOption: this.extraEncryptionOption,
                    // },
                }), (status) => {
                    console.log(status)
                    this.status = status
                });

                if (!out) throw "Transaction couldn't be made";

                this.status = ''

                const tx = JSON.parse(out)

                this.$store.commit('setTransactions', { txs: [tx], overwrite: false, })

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
