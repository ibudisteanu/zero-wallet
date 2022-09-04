<template>

    <modal ref="modal" :title="`Custom Address${title ? ': ' + title : ''}`" content-class="">

        <template v-slot:body v-if="address">

            <wizard :titles="{
                0: {icon: 'fas fa-money-bill-wave', name: 'Asset', tooltip: 'Include a default Asset' },
                1: {icon: 'fas fa-dollar-sign', name: 'Amount', tooltip: 'Include a default Amount' },
                2: {icon: 'fas fa-hand-holding-usd', name: 'Payment ID', tooltip: 'Include a Payment ID' },
                3: {icon: 'fas fa-signature', name: 'Registration', tooltip: 'Include Registration Signature' },
                4: {icon: 'fas fa-check', name: 'Done', tooltip: 'Generated Address' }}"
                @onSetTab="setTab" controls-class-name="modal-footer bg-light" :buttons="buttons" :allow-scroll="false" >

                <template v-slot:tab_0>
                    <div class="form-check">
                        <input class="form-check-input" id="paymentAsset" type="checkbox"  name="checkbox" v-model="hasPaymentAsset"  >
                        <label class="form-check-label" for="paymentAsset"> Payment Asset </label>
                        <i class="fas fa-question" v-tooltip.bottom="'Specify a default asset'" ></i>  <br>
                        <template v-if="hasPaymentAsset" >
                            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Asset which will be requested</label>
                            <input :class="`form-control ${validationPaymentAsset ? 'is-invalid' : ''}`" v-if="hasPaymentAsset" type="text" v-model="paymentAsset" >
                            <div v-if="validationPaymentAsset" class="invalid-feedback d-block">{{validationPaymentAsset}}</div>
                        </template>
                    </div>
                </template>

                <template v-slot:tab_1>
                    <div class="form-check">
                        <input class="form-check-input" id="paymentAmount" type="checkbox"  name="checkbox" v-model="hasPaymentAmount"  >
                        <label class="form-check-label" for="paymentAmount"> Amount </label>
                        <i class="fas fa-question" v-tooltip.bottom="'Specify a default amount to be sent to you'" ></i>  <br>
                        <template v-if="hasPaymentAmount">
                            <tx-amount :allow-zero="true" :allow-empty-asset="true" :balances="null" @changed="amountChanged" text="Amount to Receive" :asset="Buffer.from(paymentAsset,'hex').toString('base64')" :disabled="!hasPaymentAmount" />
                        </template>
                    </div>
                </template>

                <template v-slot:tab_2>
                    <div class="form-check">
                        <input class="form-check-input" id="paymentID" type="checkbox"  name="checkbox" v-model="hasPaymentID"  >
                        <label class="form-check-label" for="paymentID"> PaymentId</label>
                        <i class="fas fa-question" v-tooltip.bottom="'Specify a default message (paymentID)'" ></i>  <br>
                        <input :class="`form-control ${validationPaymentID ? 'is-invalid' : ''}`" v-if="hasPaymentID" type="text" v-model="paymentID" >
                        <div v-if="validationPaymentID" class="invalid-feedback d-block">{{validationPaymentID}}</div>
                    </div>
                </template>

                <template v-slot:tab_3>
                    <div class="form-check" :disabled="!address.registration">
                        <input class="form-check-input" id="registration" type="checkbox"  name="checkbox" v-model="hasRegistration"  >
                        <label class="form-check-label" for="registration"> Registration </label>
                        <i class="fas fa-question" v-tooltip.bottom="'Specify registration. Required only first time when used'" ></i>  <br>
                    </div>
                </template>

                <template v-slot:tab_4>
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

                        <div class="g-0 d-inline-block ">
                            <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer " type="button" @click="copyAddress" v-tooltip.bottom="'Copy Address'" >
                                <i class="fas fa-copy" />
                            </button>

                            <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer " type="button" @click="showAddressQRCode" v-tooltip.bottom="'Show Address QR Code'">
                                <i class="fas fa-qrcode" />
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
import Decimal from "decimal.js"

export default {

    components: {AccountIdenticon, Modal, TxAmount, Wizard},

    data(){
        return {
            address: null,
            title: "",

            hasRegistration: false,
            hasPaymentAmount: false,
            hasPaymentID: false,
            hasPaymentAsset: false,

            paymentAmount: {},
            paymentID: "",
            paymentAsset: "",

            addressGenerated: "",
        }
    },

    computed:{

        Buffer: () => Buffer,

        validationPaymentID(){
            try{

                if (!this.hasPaymentID) return ""
                if (this.paymentID.length !== 16) throw "PaymentId should be an 8 byte hexadecimal number"
                let buf
                try{
                    buf = Buffer.from(this.paymentID, "hex")
                }catch(err){
                    throw "PaymentId must be a hexadecimal number"
                }
                if (buf.length !== 8) throw "PaymentId should be an 8 byte hexadecimal number"

            }catch(err){
                return err.toString()
            }
        },

        validationPaymentAsset(){
            try{
                if (!this.hasPaymentAsset) return ""
                if (this.paymentAsset.length !== 40) throw "PaymentAsset should be a 20 byte hexadecimal number"
                let buf
                try{
                    buf = Buffer.from(this.paymentAsset, "hex")
                }catch(err){
                    throw "PaymentAsset must be a hexadecimal number"
                }
                if (buf.length !== 20) throw "PaymentAsset should be an 8 byte hexadecimal number"
            }catch(err){
                return err.toString()
            }
        },

        buttons(){
            return { 3: { icon: 'fas fa-cogs', text: 'Generate Address' }}
        },

    },

    methods: {

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === 0 && value === 1) {
                    if (this.validationPaymentAsset) throw this.validationPaymentAsset

                    if (this.hasPaymentAsset){
                      const asset = await this.$store.dispatch('getAssetByHash', Buffer.from(this.paymentAsset, "hex").toString("base64") )
                      if (!asset) throw "Payment Asset doesn't exist"
                    }

                }

                if (oldTab === 1 && value === 2)
                    if (this.paymentAmount.validationError) throw this.paymentAmount.validationError

                if (oldTab === 2 && value === 3)
                    if (this.validationPaymentID) throw this.validationPaymentID

                if (oldTab === 3 && value === 4)
                    await this.handleCreateAddress()

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },

        showModal(address) {

            Object.assign(this.$data, this.$options.data.apply(this))

            this.address = address;
            this.title = address.name;

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
            this.paymentAmount = {...this.paymentAmount, ...data}
        },

        showAddressQRCode(){
            return this.$store.state.page.refQRCodeModal.showModal( this.addressGenerated, this.address.name || '');
        },

        async handleCreateAddress(){

            this.addressGenerated = ""

            let args = {
                publicKey: this.address.publicKey,
                registration: this.hasRegistration ? this.address.registration : "",
                paymentID: this.hasPaymentID ? Buffer.from(this.paymentID, "hex").toString("base64") : "",
                paymentAmount: this.hasPaymentAmount ? this.paymentAmount.amount : new Decimal(0),
                paymentAsset: this.hasPaymentAsset ? Buffer.from(this.paymentAsset, "hex").toString("base64") : "",
            }

            const out = await PandoraPay.addresses.createAddress( MyTextEncode( JSONStringify( args )  ))
            const json = JSONParse( MyTextDecode(out) )
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
