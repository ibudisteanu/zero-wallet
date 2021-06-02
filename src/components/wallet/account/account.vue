<template>
    <div>
        <div v-if="account" class="account">
            <account-identicon  :identicon="account.identicon" :size="60" :outer-size="20" :version="account.version" />
            <div class="wordwrap pd-top-10">

                <span class="bold">{{account.name}}</span>
                <span>{{typeName}}</span>
                <div class="pd-top-20">
                    <span>Address:</span>
                    <span class="thick address" >{{getAddress}} </span>
                    <i class="fa fa-2x fa-copy pointer"  @click="copyAddress(getAddress)"  v-tooltip.bottom="'Copy Address'" />
                    <i class="fa fa-2x fa-qrcode pointer" @click="showAccountQRCode(getAddress, 'Address')" v-tooltip.bottom="'Show Address QR Code'" />
                </div>

                <div class="pd-top-20">
                    <span>TODO: Generate custom address</span>
                </div>

                <account-qr-code-modal ref="refAccountQRCodeModal"/>

            </div>
        </div>

    </div>
</template>

<script>

import AccountIdenticon from "./account-identicon";
import AccountQRCodeModal from "./account-qr-code.modal"
const {version} = PandoraPay.enums.wallet.address;

export default {

    components: { AccountIdenticon, 'accountQrCodeModal': AccountQRCodeModal,  },

    props: {
        account: {default: null},
    },

    computed:{

        typeName(){
            if (!this.account) return '';
            if (this.account.version === version.VERSION_TRANSPARENT) return 'Transparent';
        },

        getAddress(){
            if (!this.account) return '';
            if (this.account.version === version.VERSION_TRANSPARENT) return this.account.addressEncoded;
        },

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
