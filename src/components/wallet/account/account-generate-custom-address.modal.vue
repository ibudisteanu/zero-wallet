<template>

    <modal ref="modal" :title="`Custom Address${title ? ': ' + title : ''}`" content-class="">

        <template slot="body" v-if="account">

            <wizard :titles="{
                0: {icon: 'fas fa-dollar-sign', name: 'Amount', tooltip: 'Include an amount' },
                1: {icon: 'fas fa-hand-holding-usd', name: 'Payment ID', tooltip: 'Include a Payment ID' },
                2: {icon: 'fas fa-signature', name: 'Registration', tooltip: 'Include Registration Signature' },
                3: {icon: 'fas fa-check', name: 'Done', tooltip: 'Generated Address' }}"
                @onSetTab="setTab" controls-class-name="modal-footer bg-light" :buttons="buttons" >

                <template slot="tab_0">
                    <div class="form-check">
                        <input class="form-check-input" id="amount" type="checkbox"  name="checkbox" v-model="hasAmount"  >
                        <label class="form-check-label" for="amount"> Amount </label>
                        <i class="fa fa-question" v-tooltip.bottom="'Specify a default amount to be sent to you'" ></i>  <br>
                        <tx-amount :allow-zero="true" :allow-empty-asset="true" :balances="null" @changed="amountChanged" text="Amount to Receive" :asset="''" :disabled="!hasAmount" />
                    </div>
                </template>

                <template slot="tab_1">
                    <div class="form-check">
                        <input class="form-check-input" id="paymentId" type="checkbox"  name="checkbox" v-model="hasPaymentId"  >
                        <label class="form-check-label" for="paymentId"> PaymentId</label>
                        <i class="fa fa-question" v-tooltip.bottom="'Specify a default message(paymentId)'" ></i>  <br>
                        <input :class="`form-control ${validationPaymentId ? 'is-invalid' : ''}`" v-if="hasPaymentId" type="text" v-model="paymentId" >
                        <div v-if="validationPaymentId" class="invalid-feedback d-block">{{validationPaymentId}}</div>
                    </div>
                </template>

                <template slot="tab_2">
                    <div class="form-check" v-if="account.registration">
                        <input class="form-check-input" id="registration" type="checkbox"  name="checkbox" v-model="hasRegistration"  >
                        <label class="form-check-label" for="registration"> Registration </label>
                        <i class="fa fa-question" v-tooltip.bottom="'Specify registration. Required only first time when used'" ></i>  <br>
                    </div>
                </template>

                <template slot="tab_3">
                    <template v-if="addressGenerated">

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
                            <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer " type="button" @click="copyAddress" v-tooltip.bottom="'Copy Address'" >
                                <i class="fa fa-copy" />
                            </button>

                            <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer " type="button" @click="showAccountQRCode" v-tooltip.bottom="'Show Address QR Code'">
                                <i class="fa fa-qrcode" />
                            </button>
                        </div>

                    </template>
                </template>

            </wizard>

        </template>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import AccountIdenticon from "./account-identicon";
import TxAmount from "src/components/send/tx-amount"
import Wizard from "src/components/utils/wizard"

export default {

    components: {AccountIdenticon, Modal, TxAmount, Wizard},

    data(){
        return {
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
                    throw "PaymentId must be a hexadecimal number"
                }
                if (buf.length !== 8) throw "PaymentId should be an 8 byte hexadecimal number"

            }catch(err){
                return err.toString()
            }
        },

        buttons(){
            return { 2: { icon: 'fa fa-cogs', text: 'Generate Address' }}
        },

    },

    methods: {

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === 0 && value === 1)
                    if (this.amount.validationError) throw this.amount.validationError

                if (oldTab === 1 && value === 2)
                    if (this.validationPaymentId) throw this.validationPaymentId

                if (oldTab === 2 && value === 3)
                    await this.handleGenerateAddress()

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
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

            this.addressGenerated = ""

            let args = {
                publicKey: this.account.publicKey,
                registration: this.hasRegistration ? this.account.registration : "",
                amount: this.hasAmount ? Number.parseInt(this.amount.amount) : 0,
                paymentId: this.hasPaymentId ? this.paymentId : "",
            }

            console.log(args)

            const out = await PandoraPay.addresses.generateAddress( MyTextEncode( JSON.stringify( args )  ))
            const json = JSON.parse( MyTextDecode(out) )
            this.addressGenerated = json[1]

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
