<template>
    <div>
        <div v-if="address" class="account">
            <account-identicon  :identicon="address.identicon" :size="60" :outer-size="20" :type="address.type" />
            <div class="wordwrap pd-top-10">
                <span class="">{{address.name}}</span> <br/>
                <span>{{typeName}}</span> <br/>
                <div class="pd-top-20">
                    Address: <br/>
                    <span class=" thick">{{getAddress}} </span>
                    <i class="fa fa-2x fa-copy pointer"  @click="copyAddress(getAddress)"/>
                    <i class="fa fa-2x fa-qrcode pointer" @click="showAccountQRCode(getAddress, 'Address')" />
                    <br/> <br/>
                </div>
                <div class="pd-top-20">
                    Address Public Key (to receive encrypted messages too): <br/>
                    <span class=" thick">{{getAddressPublicKey}} </span>
                    <i class="fa fa-2x fa-copy pointer"  @click="copyAddress(getAddressPublicKey)"/>
                    <i class="fa fa-2x fa-qrcode pointer" @click="showAccountQRCode(getAddressPublicKey, 'Address Public Key')"/>
                    <br/> <br/>
                </div>

                <account-qr-code-modal ref="refAccountQRCodeModal"/>

            </div>
        </div>

    </div>
</template>

<script>

import AccountIdenticon from "./account-identicon";
import AccountQRCodeModal from "./account-qr-code.modal"
const {WalletAddressTypeEnum} = global.blockchain.blockchain.wallet;

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

<style>

    .account{
        display: grid;
        grid-template-columns: 100px 1fr;
        grid-column-gap: 10px;
    }

    .account span{
        display: inline-block;
    }

    .account i{
        display: inline-block;
    }

</style>