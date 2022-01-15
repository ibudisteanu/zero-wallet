<template>

    <layout>

        <layout-title icon="fas fa-wallet" title="Wallet">Access the private key of the selected address.</layout-title>

        <wait-address :address="address">

            <account :address="address" />

            <div class="card mb-3">
                <div class="card-header bg-light">
                    <div class="row align-items-center">
                        <div class="col">
                            <h5 class="mb-0">Account Additional Details</h5>
                        </div>
                    </div>
                </div>
                <div class="card-body">

                    <div class="row py-2">
                        <div v-if="!showPublicKey" class="pointer  w-auto" @click="showPublicKey = true">
                            View Public Key
                        </div>
                        <div v-else>
                            Public Key: {{address.publicKey}}
                            <i class="fas fa-copy pointer  d-inline-block" v-tooltip.bottom="'Copy Public Key'"  @click="handleCopyAddress(address.publicKey)" />
                        </div>
                    </div>

                    <div class="row py-2">
                        <div v-if="!showRegistration" class="pointer  w-auto" @click="showRegistration = true">
                            View Registration Key
                        </div>
                        <div v-else>
                            Registration Key: {{address.registration}}
                            <i class="fas fa-copy pointer  d-inline-block" v-tooltip.bottom="'Copy Registration'"  @click="handleCopyAddress(address.registration)" />
                        </div>
                    </div>

                </div>

                <div class="card-body bg-light">

                    <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer " type="button" @click="handleExportAddress" v-tooltip.bottom="'Export Account'" >
                        <i class="fas fa-download"></i>
                    </button>

                    <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer " type="button" @click="handleDeleteAddress" v-tooltip.bottom="'Delete Account'" >
                        <i class="danger fas fa-times"></i>
                    </button>

                    <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer " type="button" @click="handleShowPrivateKey" v-tooltip.bottom="'View Private Key'" >
                        <i class="fas fa-eye"></i>
                    </button>

                </div>
            </div>

            <account-private-key-modal ref="refAccountPrivateKeyModal" :address="address"/>
            <account-delete-modal ref="refAccountDeleteModal" :address="address"/>

        </wait-address>

    </layout>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon";
import FileSaver from 'file-saver'
import consts from 'consts/consts';
import AccountPrivateKeyModal from "src/components/wallet/account/account-private-key.modal"
import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title";
import Account from "src/components/wallet/account/account"
import AccountDeleteModal from "src/components/wallet/account/account-delete.modal"
import WaitAddress from "../../components/wallet/account/wait-address";

export default {

    components: {WaitAddress, AccountIdenticon, AccountPrivateKeyModal, Layout, Account, LayoutTitle, AccountDeleteModal},

    data(){
        return {
            showPublicKey: false,
            showRegistration: false,
        }
    },


    computed:{
        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey];
        }
    },

    methods:{

        async handleExportAddress(){

            if ( typeof Blob === "undefined")
                return this.$store.dispatch('addToast', {
                    type: 'error',
                    title: `Blob is not supported by your Browser`,
                    text: `Update your browser`,
                })

            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            const jsonData = await PandoraPay.wallet.manager.getWalletAddress(  this.address.publicKey, password );
            if (!jsonData) return false;

            const json = MyTextDecode(jsonData)

            const fileName = consts.name + "_" +this.address.name + "_"+this.address.addressEncoded + ".pandora";

            const file = new Blob([json], {type: "application/json;charset=utf-8"});
            FileSaver.saveAs(file, fileName);

            return this.$store.dispatch('addToast', {
                type: 'success',
                title: `Address ${this.address.name} has been saved on your machine`,
                text: `The address ${this.address.addressEncoded} has been saved in the downloads folder.`,
            });
        },

        handleShowPrivateKey(){
            return this.$refs.refAccountPrivateKeyModal.showModal(this.address);
        },

        handleDeleteAddress(){
            return this.$refs.refAccountDeleteModal.showModal(this.address)
        },

        handleCopyAddress(key){

            this.$copyText(key).then(
                e => this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `${key} copied to clipboard`,
                }),
                e => this.$store.dispatch('addToast', {
                    type: 'error',
                    title: `Clipboard failed`,
                    text: `Failed to copy to clipboard`,
                })
            )

        }

    },

}
</script>

<style scoped>
</style>
