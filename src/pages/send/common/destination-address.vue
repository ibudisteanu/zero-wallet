<template>

    <div>
        <span class="disabled">Destination Address {{index+1}}</span> <br/>

        <div :class="`${destinationAddressIdenticon ? 'destination': ''}-row`">

            <account-identicon v-if="destinationAddressIdenticon" :identicon="destinationAddressIdenticon" size="35" outer-size="8" />

            <div class="input-toggle-group">
                <input type="text" v-model="destinationAddress">
                <i class="fa fa-qrcode input-toggle" @click="qrCodeScanner"></i>
            </div>

        </div>

        <destination-amount @changed="changedDestinationAmount" />

    </div>


</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon"
import DestinationAmount from "./destination-amount.vue"
import QrCodeScanner from "src/components/utils/qr-code-scanner/qr-code-scanner";

export default {

    components: {AccountIdenticon, DestinationAmount, QrCodeScanner},

    data(){
        return {
            destinationAddress: '',
        }
    },

    props:{
        index: 0,
        balances: {default: null },
    },

    computed:{

        validationError(){

            try{

                if (!this.destinationAddress) throw {message: `Destination ${this.destinationAddress} Address not specified`};

                const address = PandoraPay.cryptography.addressValidator.validateAddress( this.destinationAddress );
                if (!address) throw {message: `Address ${this.destinationAddress} is invalid`};

                return '';

            }catch(err){
                return err.message;
            }
        },

        destinationAddressIdenticon(){

            try{
                const address = PandoraPay.cryptography.addressValidator.validateAddress( this.destinationAddress );
                if (!address) throw {message: `Address ${this.destinationAddress} is invalid`};

                return address.identiconImg();

            }catch(err){

            }

        },
    },

    watch: {
        'destinationAddress' (to, from) {
            return this.$emit('changed', {
                destinationAddress: to,
                validationError: this.validationError,
            });
        }
    },

    methods: {

        qrCodeScanner(){
            this.$refs.refQRCodeScannerModal.showModal();
        },

        changedDestinationAmount(data){
            return this.$emit('changed', {
                ...data,
                validationError: this.validationError,
            });
        }

    }

}
</script>

<style scoped>
    .destination-row{
        display: grid;
        grid-template-columns: 50px 1fr;
        grid-column-gap: 10px;
    }



</style>