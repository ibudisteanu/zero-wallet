<template>

    <layout>

        <layout-title icon="fas fa-wallet" title="Wallet">Access the private key of the selected address.</layout-title>

        <wait-address :address="walletAddress">

            <account :address="walletAddress" />

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
                        <div class="text-truncate" v-else>
                            Public Key: {{walletAddress.publicKey}}
                            <i class="fas fa-copy pointer  d-inline-block" v-tooltip.bottom="'Copy Public Key'"  @click="handleCopyAddress(walletAddress.publicKey)" />
                        </div>
                    </div>

                    <div class="row py-2">
                        <div v-if="!showRegistration" class="pointer  w-auto" @click="showRegistration = true">
                            View Registration Public Signature
                        </div>
                        <div class="text-truncate" v-else>
                            Registration Public Signature: {{walletAddress.registration}}
                            <i class="fas fa-copy pointer  d-inline-block" v-tooltip.bottom="'Copy Registration'"  @click="handleCopyAddress(walletAddress.registration)" />
                        </div>
                    </div>

                </div>

                <div class="card-body bg-light">

                    <button class="btn btn-falcon-default rounded-pill me-2 mb-1 pointer" type="button" @click="handleExportAddress" v-tooltip.bottom="'Export Account'" >
                        <i class="fas fa-download"></i>
                    </button>

                    <button class="btn btn-falcon-default rounded-pill me-2 mb-1 pointer" type="button" @click="handleDeleteAddress" v-tooltip.bottom="'Delete Account'" >
                        <i class="danger fas fa-times"></i>
                    </button>

                    <button class="btn btn-falcon-default rounded-pill me-2 mb-1 pointer" type="button" @click="handleShowSecretKey" v-tooltip.bottom="'View Secret Key'" >
                        <i class="fas fa-eye"></i>
                    </button>

                    <button class="btn btn-falcon-default rounded-pill me-2 mb-1 pointer" type="button" @click="handleRenameAddressName" v-tooltip.bottom="'Rename Address Tag'" >
                        <i class="fas fa-edit"></i>
                    </button>

                    <button class="btn btn-falcon-default rounded-pill me-2 mb-1 pointer" type="button" @click="handleSignMessage" v-tooltip.bottom="'Sign message'" >
                      <i class="fas fa-signature"></i>
                    </button>

                </div>
            </div>

            <account-delete-modal ref="refAccountDeleteModal" />
            <account-sign-message ref="refAccountSignMessage" />
            <account-rename-modal ref="refAccountRenameModal" />

        </wait-address>

    </layout>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon";
import FileSaver from 'file-saver'
import consts from 'consts/consts';
import AccountRenameModal from "src/components/wallet/account/account-rename.modal"
import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title";
import Account from "src/components/wallet/account/account"
import AccountDeleteModal from "src/components/wallet/account/account-delete.modal"
import WaitAddress from "src/components/wallet/account/wait-address";
import AccountSignMessage from "src/components/wallet/account/account-sign-message-modal"

export default {

    components: {
      AccountSignMessage,
      WaitAddress, AccountIdenticon, AccountRenameModal, Layout, Account, LayoutTitle, AccountDeleteModal},

    data(){
        return {
            showPublicKey: false,
            showRegistration: false,
        }
    },


    computed:{
        walletAddress(){
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

            const jsonData = await PandoraPay.wallet.manager.getWalletAddress(  password, this.walletAddress.publicKey );
            if (!jsonData) return false;

            const json = MyTextDecode(jsonData)

            const fileName = consts.name + "_" +this.walletAddress.name + "_"+this.walletAddress.addressEncoded + ".pandora";

            const file = new Blob([json], {type: "application/json;charset=utf-8"});
            FileSaver.saveAs(file, fileName);

            return this.$store.dispatch('addToast', {
                type: 'success',
                title: `Address ${this.walletAddress.name} has been saved on your machine`,
                text: `The address ${this.walletAddress.addressEncoded} has been saved in the downloads folder.`,
            });
        },

        async handleShowSecretKey(){
            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            const secretKey = await PandoraPay.wallet.getWalletAddressSecretKey( password, this.walletAddress.publicKey )

            return this.$store.state.page.refSecretModal.showModal(secretKey, `Secret Key of ${this.walletAddress ? this.walletAddress.name : ''}`, 'DO NOT share this secret key with anyone! This private key can be used to STEAL YOUR FUNDS FROM THIS ACCOUNT');
        },

        handleSignMessage(){
          return this.$refs.refAccountSignMessage.showModal(this.walletAddress)
        },

        handleDeleteAddress(){
            return this.$refs.refAccountDeleteModal.showModal(this.walletAddress)
        },

        handleRenameAddressName(){
            return this.$refs.refAccountRenameModal.showModal(this.walletAddress)
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

        },

    },

}
</script>

<style scoped>
</style>
