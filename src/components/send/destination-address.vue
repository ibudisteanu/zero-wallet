<template>

    <div>
        <span class="disabled">Destination Address {{index !== null ? index+1 : ''}}</span>

        <div :class="`${identicon ? 'destination': ''}-row`">

            <account-identicon v-if="identicon" :identicon="identicon" size="35" outer-size="8" :type="type" />

            <div class="input-toggle-group">
                <input type="text" v-model="destination">
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
            destination: '',
        }
    },

    props:{
        index: {default: null},
        type: {default: 0},
        balances: {default: null },
    },

    computed:{

        addressValidated(){
            try{
                if (this.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT) return PandoraPay.cryptography.addressValidator.validateAnyAddress( this.destination );
            }catch(err){
            }
        },

        address(){
            if (!this.addressValidated) return '';

            if (this.addressValidated.publicKey)
                return this.addressValidated.generateAddress().calculateAddress();

            return this.addressValidated.calculateAddress();
        },

        validationError(){
            if (!this.destination) return`Destination ${this.destination} Address not specified`;
            if (!this.addressValidated) return `Address ${this.destination} is invalid`;
        },

        identicon(){
            if (this.addressValidated) return this.addressValidated.identiconImg();
        },
    },

    watch: {
        'addressValidated' (to, from) {
            return this.$emit('changed', {
                addressModel: to,
                address: this.address,
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