<template>

    <modal ref="modal" :title="`Custom Address ${title ? ': ' + title : ''}`" content-class="">

        <template slot="body" v-if="account">

            <div class="theme-wizard">
                <div class="card-header bg-light pt-0 pb-2">
                    <ul class="nav justify-content-between nav-wizard">
                        <li class="nav-item">
                            <span :class="`nav-link ${tab===0?'active':''} fw-semi-bold`" >
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-dollar-sign"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Amount</span>
                            </span>
                        </li>
                        <li class="nav-item">
                            <span :class="`nav-link ${tab===1?'active':''} fw-semi-bold`" >
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-hand-holding-usd"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Payment ID</span>
                            </span>
                        </li>
                        <li class="nav-item">
                            <span :class="`nav-link ${tab===2?'active':''} fw-semi-bold`" >
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-signature"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Registration</span>
                            </span>
                        </li>
                        <li class="nav-item">
                            <span :class="`nav-link ${tab===3?'active':''} fw-semi-bold`" >
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-check"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Done</span>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="card-body py-3">
                    <div class="tab-content">
                        <div :class="`tab-pane ${tab===0?'active':''}`">
                            <div class="form-check">
                                <input class="form-check-input" id="amount" type="checkbox"  name="checkbox" v-model="hasAmount"  >
                                <label class="form-check-label" for="amount"> Amount </label>
                                <i class="fa fa-question" v-tooltip.bottom="'Specify a default amount to be sent to you'" ></i>  <br>
                                <tx-amount :allow-zero="true" :allow-empty-token="true" :balances="null" @changed="amountChanged" text="Amount to Receive" :token="''" :disabled="!hasAmount" />
                            </div>
                        </div>
                        <div :class="`tab-pane ${tab===1?'active':''} `">
                            <div class="form-check">
                                <input class="form-check-input" id="paymentId" type="checkbox"  name="checkbox" v-model="hasPaymentId"  >
                                <label class="form-check-label" for="paymentId"> PaymentId</label>
                                <i class="fa fa-question" v-tooltip.bottom="'Specify a default message(paymentId)'" ></i>  <br>
                                <input :class="`form-control ${validationPaymentId ? 'is-invalid' : ''}`" v-if="hasPaymentId" type="text" v-model="paymentId" >
                                <div v-if="validationPaymentId" class="invalid-feedback d-block">{{validationPaymentId}}</div>
                            </div>
                        </div>
                        <div :class="`tab-pane ${tab===2?'active':''}`">
                            <div class="form-check" v-if="account.registration">
                                <input class="form-check-input" id="registration" type="checkbox"  name="checkbox" v-model="hasRegistration"  >
                                <label class="form-check-label" for="registration"> Registration </label>
                                <i class="fa fa-question" v-tooltip.bottom="'Specify registration. Required only first time when used'" ></i>  <br>
                            </div>
                        </div>
                        <div :class="`tab-pane ${tab===3?'active':''} `">

                            <template v-if="this.addressGenerated">

                                <div class="form-outline">
                                    <label class="form-label" for="address">Generated Address</label>
                                    <div id="address" class="address align-items-center">
                                        <account-identicon :address="this.addressGenerated" size="30" outer-size="10" />
                                        <span class="text-break">
                                            {{this.addressGenerated}}
                                        </span>
                                    </div>
                                </div>

                                <hr/>

                                <div class="g-0 d-block-inline ">
                                    <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer" type="button" @click="copyAddress" v-tooltip.bottom="'Copy Address'" >
                                        <i class="fa fa-copy" />
                                    </button>

                                    <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer" type="button" @click="showAccountQRCode" v-tooltip.bottom="'Show Address QR Code'">
                                        <i class="fa fa-qrcode" />
                                    </button>
                                </div>
                            </template>

                        </div>
                    </div>
                </div>
            </div>

        </template>

        <template slot="footer">
            <alert-box v-if="error" class="w-100" type="error">{{error}}</alert-box>

            <loading-button v-if="tab > 0" text="Back" @submit="handleBack" icon="fas fa-chevron-left ms-2" classCustom="btn btn-link" :iconLeft="false" />
            <loading-button v-if="tab < maxTab" :text="`${tab === maxTab-1 ? 'Generate address' : 'Next'}`" @submit="handleNext" :icon="`${ tab === maxTab-1 ? 'fa fa-cogs' : 'fas fa-chevron-right ms-2' }`"  />

        </template>


    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import AlertBox from "src/components/utils/alert-box"
import AccountIdenticon from "./account-identicon";
import LoadingButton from "src/components/utils/loading-button"
import TxAmount from "src/components/send/tx-amount"

export default {

    components: {AccountIdenticon, Modal, AlertBox, LoadingButton, TxAmount},

    data(){
        return {
            tab: 0,
            maxTab: 3,

            error: '',
            account: null,
            title: "",

            hasRegistration: false,
            hasAmount: false,
            hasPaymentId: false,

            amount: {},
            paymentId: "",

            addressGenerated: "",
        }
    },

    computed:{

        validationPaymentId(){
            try{
                if (!this.hasPaymentId) return ""
                if (this.paymentId.length !== 16) throw "PaymentId should be an 8 byte hexadecimal number"
                let buf
                try{
                    buf = Buffer.from(this.paymentId, "hex")
                }catch(err){
                    throw "PaymentId must be a hexadeciaml number"
                }
                if (buf.length !== 8) throw "PaymentId should be an 8 byte hexadecimal number"


            }catch(err){
                return err.toString()
            }
        }

    },

    methods: {

        async setTab(resolver, value){
            try{

                value = Math.max( value, 0)
                value = Math.min( value, this.maxTab + 1)

                if (this.tab === 0 && value === 1){
                    if (this.amount.validationError) throw this.amount.validationError
                }
                if (this.tab === 2 && value === 3){
                    await this.handleGenerateAddress()
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

        showModal(account) {

            Object.assign(this.$data, this.$options.data());

            this.account = account;
            this.title = account.name;

            return this.$refs.modal.showModal();

        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        copyAddress(){
            this.$copyText(this.addressGenerated).then(
                e => this.$store.dispatch('addToast', {
                        type: 'success',
                        title: `Copied to clipboard successfully`,
                        text: `Address ${this.addressGenerated} copied to clipboard`,
                    }),
                e => this.$store.dispatch('addToast', {
                        type: 'error',
                        title: `Clipboard failed`,
                        text: `Failed to copy to clipboard`,
                    })
            )
        },

        amountChanged(data){
            this.amount = {...this.amount, ...data}
        },

        showAccountQRCode(){
            return this.$store.state.page.refQRCodeModal.showModal( this.addressGenerated, this.account.name || '');
        },

        async handleGenerateAddress(){

            this.error = ""
            this.addressGenerated = ""

            try{

                let args = [
                    this.account.publicKey,
                    this.hasRegistration ? this.account.registration : "",
                    this.hasAmount ? Number.parseInt(this.amount.amount) : 0,
                    this.hasPaymentId ? this.paymentId : "" ,
                ]

                console.log(args)

                const out = await PandoraPay.addresses.generateAddress( ...args )
                this.addressGenerated = out[1]

            }catch(err){
                this.error = err.toString()
            }

        },


    }

}
</script>

<style scoped>
    .address{
        display: grid;
        grid-template-columns: 50px 1fr;
        grid-column-gap: 10px;
    }
</style>
