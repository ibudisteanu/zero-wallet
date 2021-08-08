<template>

    <div>
        <div class="col">
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Destination Address {{index !== null ? index+1 : ''}}</label>
            <i class="fa fa-times float-end pointer" @click="deleteDestinationAddress"></i>

            <div :class="`${finalAddress ? 'destination-row': ''} `" >

                <account-identicon v-if="finalAddress" :public-key="finalAddress.publicKey" :public-key-hash="finalAddress.publicKeyHash" size="30" outer-size="8" :version="finalAddress.version" />

                <div class="input-toggle-group">
                    <input :class="`form-control ${validationError ? 'is-invalid' : ''}`" type="text" v-model="destination">
                    <i class="fa fa-qrcode input-toggle" @click="showQrCodeScanner" :style="`${ validationError ?'right: 35px' : ''}`"></i>
                </div>

            </div>
            <div v-if="validationError" class="invalid-feedback d-block">{{validationError}}</div>

        </div>
        <destination-amount class="pt-2" @changed="changedDestinationAmount" :balances="balances" />
    </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon"
import DestinationAmount from "./destination-amount.vue"
const {VERSION_TRANSPARENT} = PandoraPay.enums.wallet.address.version;

export default {

    components: {AccountIdenticon, DestinationAmount},

    data(){
        return {
            destination: '',
            finalAddress: null,
            identiconSrc: null,
        }
    },

    props:{
        index: {default: null},
        type: {default: 0},
        balances: {default: null },
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

                if (this.type === VERSION_TRANSPARENT){
                    const addressData = await PandoraPay.addresses.decodeAddress(to)
                    const address = JSON.parse(addressData)
                    this.finalAddress = address
                    return
                }

            }catch(err){
            }

            this.finalAddress = null
        },

        finalAddress (to, from){
            return this.$emit('changed', {
                address: this.finalAddress,
                encodedAddress: this.destination,
                validationError: this.validationError,
            });
        },

    },

    methods: {

        async showQrCodeScanner(){
            const out = await this.$store.state.page.refQRCodeScannerModal.showModal();
            if (out.decoded)
                this.destination = out
        },

        changedDestinationAmount(data){
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
