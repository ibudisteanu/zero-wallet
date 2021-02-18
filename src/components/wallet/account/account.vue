<template>
    <div>
        <div v-if="address" class="account">
            <account-identicon  :identicon="address.identicon" :size="60" :outer-size="20" :type="address.type" />
            <div class="wordwrap pd-top-10">
                <span class="">{{address.name}}</span>
                <span>{{typeName}}</span>
                <div class="pd-top-20">
                    <span>Address:</span>
                    <span class="thick address" >{{getAddress}} </span>
                    <i class="fa fa-2x fa-copy pointer"  @click="copyAddress(getAddress)"  v-tooltip.bottom="'Copy Address'" />
                    <i class="fa fa-2x fa-qrcode pointer" @click="showAccountQRCode(getAddress, 'Address')" v-tooltip.bottom="'Show Address QR Code'" />
                </div>
                <div class="pd-top-20">
                    <span>Address Public Key (to receive encrypted messages too):</span>
                    <span class="thick address">{{getAddressPublicKey}} </span>
                    <i class="fa fa-2x fa-copy pointer"  @click="copyAddress(getAddressPublicKey)" v-tooltip.bottom="'Copy Address Public Key'" />
                    <i class="fa fa-2x fa-qrcode pointer" @click="showAccountQRCode(getAddressPublicKey, 'Address Public Key')" v-tooltip.bottom="'Show Address Public Key QR Code'" />
                </div>

                <account-qr-code-modal ref="refAccountQRCodeModal"/>

            </div>
        </div>

    </div>
</template>

<script>

import AccountIdenticon from "./account-identicon";
import AccountQRCodeModal from "./account-qr-code.modal"
const {WalletAddressTypeEnum} = PandoraLibrary.blockchain.wallet;

export default {

    components: { AccountIdenticon, 'accountQrCodeModal': AccountQRCodeModal,  },

    props: {
        address: {default: null},
    },

    computed:{

        typeName(){
            if (!this.address) return '';
            if (this.address.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT) return 'Transparent';
        },

        getAddress(){
            if (!this.address) return '';
            if (this.address.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT) return this.address.address;
        },

        getAddressPublicKey(){
            if (!this.address) return '';
            if (this.address.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT) return this.address.addressPublicKey;
        }

    },

    methods: {
        copyAddress(address){

            this.$copyText(address).then( e =>
                this.$notify({
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `Address ${address} copied to clipboard`,
                }),
                e =>
                this.$notify({
                    type: 'error',
                    title: `Clipboard failed`,
                    text: `Failed to copy to clipboard`,
                })
            )

        },

        showAccountQRCode(address, title){
            this.$refs.refAccountQRCodeModal.showModal(address, title);
        }

    },

}
</script>

<style scoped>

    .account{
        display: grid;
        grid-template-columns: 100px 1fr;
        grid-column-gap: 10px;
    }

    .account .address{
        display: inline-block;
    }

    .account i{
        display: inline-block;
        padding-right: 5px;
        padding-left: 5px;
    }

</style>