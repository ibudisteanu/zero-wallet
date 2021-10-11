<template>

    <div>
        <div class="col">
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Destination Address {{index !== null ? index+1 : ''}}</label>
            <i v-if="index !== null" class="fa fa-times float-end pointer" @click="deleteDestinationAddress"></i>

            <div :class="`${finalAddress ? 'destination-row': ''} `" >

                <account-identicon v-if="finalAddress" :public-key="finalAddress.publicKey" size="30" outer-size="8" />

                <div class="input-toggle-group">
                    <input :class="`form-control ${validationError ? 'is-invalid' : ''}`" type="text" v-model="destination">
                    <i class="fa fa-qrcode input-toggle" @click="showQrCodeScanner" :style="`${ validationError ?'right: 35px' : ''}`"></i>
                </div>

            </div>
            <div v-if="validationError" class="invalid-feedback d-block">{{validationError}}</div>

        </div>
        <tx-amount class="pt-2" @changed="changedTxAmount" :accounts="accounts" :asset="asset" />
    </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon"
import TxAmount from "./tx-amount"

export default {

    components: {AccountIdenticon, TxAmount},

    data(){
        return {
            destination: '',
            finalAddress: null,
            identiconSrc: null,
        }
    },

    props:{
        index: {default: null},
        asset: {default: ""},
        accounts: {default: null },
    },

    computed:{
        validationError(){
            if (!this.destination) return`Destination Address not specified`;
            if (!this.finalAddress) return `Address is invalid`;
        },
    },

    watch: {
        async destination (to, ) {
            try{
                const addressData = await PandoraPay.addresses.decodeAddress(to)
                const address = JSON.parse( MyTextDecode(addressData) )
                this.finalAddress = address
                return
            }catch(err){
            }

            this.finalAddress = null
        },

        finalAddress: {
            immediate: true,
            handler: function (to, from) {
                return this.$emit('changed', {
                    address: this.finalAddress,
                    addressEncoded: this.destination,
                    validationError: this.validationError,
                });
            }
        },

    },

    methods: {

        async showQrCodeScanner(){
            const out = await this.$store.state.page.refQRCodeScannerModal.showModal();
            if (out.decoded)
                this.destination = out
        },

        changedTxAmount(data){
            return this.$emit('changed', {
                ...data,
            });
        },

        deleteDestinationAddress(){
            return this.$emit('deleted')
        }

    }

}
</script>

<style scoped>
.destination-row{
    display: grid;
    grid-template-columns: 45px 1fr;
    grid-column-gap: 10px;
}
</style>
