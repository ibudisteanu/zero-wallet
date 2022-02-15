<template>

    <div>
        <div class="col">
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">{{text}} Address {{index !== null ? index+1 : ''}}</label>
            <i v-if="index !== null" class="fas fa-times float-end pointer " @click="handleDeleteRecipientAddress"></i>

            <div :class="`${finalAddress ? 'recipient-row': ''} `" >

                <account-identicon v-if="finalAddress" :public-key="finalAddress.publicKey" size="30" outer-size="8" />

                <div class="input-toggle-group">
                    <input :class="`form-control ${validationError ? 'is-invalid' : ''}`" type="text" v-model="recipient">
                    <i class="fas fa-qrcode input-toggle" @click="showQrCodeScanner" :style="`${ validationError ?'right: 35px' : ''}`"></i>
                </div>

            </div>
            <div v-if="validationError" class="invalid-feedback d-block">{{validationError}}</div>

        </div>
        <tx-amount :text="text" :validate-amount="validateAmount" :allow-zero="allowZero"  class="pt-2" :balances="balances" :asset="asset" @changed="changedTxAmount" />
    </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon"
import TxAmount from "./tx-amount"

export default {

    components: {AccountIdenticon, TxAmount},

    data(){
        return {
            recipient: '',
            finalAddress: null,
            identiconSrc: null,
        }
    },

    props:{
        index: {default: null},
        asset: {default: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64},
        balances: {default: null },
        text: {default: "Recipient"},
        allowZero: {default: false},
        validateAmount: {default: false},
    },

    computed:{
        validationError(){
            if (!this.recipient) return `${this.text} was not specified`;
            if (!this.finalAddress) return `${this.text} is invalid`;
        },
    },

    watch: {
        recipient: {
            immediate: true,
            handler: async function  (to, ) {
                try{
                    const addressData = await PandoraPay.addresses.decodeAddress(to)
                    const address = JSONParse( MyTextDecode(addressData) )
                    this.finalAddress = address
                }catch(err){
                    this.finalAddress = null
                }

                this.$emit('changed', {
                    address: this.finalAddress,
                    addressEncoded: this.recipient,
                    validationError: this.validationError,
                });

            },
        },

    },

    methods: {

        async showQrCodeScanner(){
            const out = await this.$store.state.page.refQRCodeScannerModal.showModal();
            if (out) this.recipient = out
            console.log("showQrCodeScanner", out)
        },

        changedTxAmount(data){
            return this.$emit('changed', { ...data, });
        },

        handleDeleteRecipientAddress(){
            return this.$emit('deleted')
        }

    }

}
</script>

<style scoped>
.recipient-row{
    display: grid;
    grid-template-columns: 45px 1fr;
    grid-column-gap: 10px;
}
</style>
