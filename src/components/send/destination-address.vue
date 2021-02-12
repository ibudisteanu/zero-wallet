<template>

    <div>
        <span class="disabled">Destination Address {{index !== null ? index+1 : ''}}</span> <br/>

        <div :class="`${destinationAddressIdenticon ? 'destination': ''}-row`">

            <account-identicon v-if="destinationAddressIdenticon" :identicon="destinationAddressIdenticon" size="35" outer-size="8" :type="type" />

            <div class="input-toggle-group">
                <input type="text" v-model="destinationAddress">
                <i class="fa fa-qrcode input-toggle" @click="qrCodeScanner"></i>
            </div>

        </div>

        <destination-amount @changed="changedDestinationAmount" :balances="balances" />

    </div>


</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon"
import DestinationAmount from "./destination-amount.vue"
import QrCodeScanner from "src/components/utils/qr-code-scanner/qr-code-scanner";
const {WalletAddressTypeEnum} = global.blockchain.blockchain.wallet;

export default {

    components: {AccountIdenticon, DestinationAmount, QrCodeScanner},

    data(){
        return {
            destinationAddress: '',
        }
    },

    props:{
        index: {default: null},
        type: {default: 0},
        balances: {default: null },
    },

    computed:{

        validationError(){

            try{

                if (!this.destinationAddress) throw {message: `Destination ${this.destinationAddress} Address not specified`};

                let address;

                if (this.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT) address = PandoraPay.cryptography.addressValidator.validateAddress( this.destinationAddress );

                if (!address) throw {message: `Address ${this.destinationAddress} is invalid`};

                return '';

            }catch(err){
                return err.message;
            }
        },

        destinationAddressIdenticon(){
            try{
                if (this.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT) return PandoraPay.cryptography.addressValidator.validateAddress( this.destinationAddress ).identiconImg();
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