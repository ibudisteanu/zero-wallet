<template>

    <div class="dropdown-menu dropdown-menu-end dropdown-menu-card dropdown-menu-notification show">
        <div class="card card-notification shadow-none">
            <div class="card-header">
                <div class="row justify-content-between align-items-center">
                    <div class="col-auto">
                        <h6 class="card-header-title mb-0">My accounts</h6>
                    </div>
                </div>
            </div>

            <div class="list-group list-group-flush fs--1">
                <div class="list-group-title border-bottom">All accounts:</div>
                <div class="list-group-item div-scrollable" style="max-height:19rem" >
                    <div v-for="(walletAddr, index) in walletAddresses" :class="`notification notification-flush notification-unread ${ walletAddr.publicKey === mainPublicKey  ? 'fw-black' : ''} ` "
                         :key="`wallet-address-${index}`">
                            <div class="notification-body address">
                                <account-identicon :address="walletAddr.addressEncoded" size="21" outer-size="7"  :disable-route="true" />
                                <div class="account-title pointer " @click="setMainPublicKey(walletAddr.publicKey)">
                                    <span class="fw-semi-bold text-truncate">{{walletAddr.name}}</span>
                                    <span class="fw-normal text-truncate">{{$store.getters.addressDisplay(walletAddr)}} </span>
                                </div>
                                <div class="account-tools">
                                    <span class="fw-light" >{{ walletAddr.isImported ?  '&nbsp;'  : '#'+walletAddr.seedIndex }}</span>
                                    <i class="fas fa-copy pointer " v-tooltip.bottom="'Copy Address'" @click.stop="copyAddress( walletAddr)" />
                                </div>
                            </div>
                    </div>
                </div>
                <div class="list-group-item">
                    <div class="list-group-title border-bottom">Operations:</div>
                    <span @click="handleViewAccount" v-tooltip.left="'View account'" class="pointer dropdown-item "> <i class="fas fa-hand-pointer "></i> View account </span>
                    <span @click="handleCreateNewAddress" v-tooltip.left="'Create a new Address'" class="pointer dropdown-item fw-normal "> <i class="fas fa-plus"></i> Create Account </span>
                    <span @click="handleImportAccount" v-tooltip.left="'Import an address from json file'" class="pointer dropdown-item fw-normal "><i class="fas fa-upload"></i> Import Account (json)</span>
                    <span @click="handleImportAccountSecretKey" v-tooltip.left="'Import an address from Secret Key'" class="pointer dropdown-item fw-normal "><i class="fas fa-upload"></i> Import Account Secret Key</span>
                    <div class="dropdown-divider"></div>
                    <span @click="handleViewMnemonic" v-tooltip.left="'Show your Secret Words (Mnemonic)'" class="pointer dropdown-item fw-normal "><i class="fas fa-key"></i>View Secret Phrase</span>
                    <div class="dropdown-divider"></div>
                    <span @click="handleNewWallet" v-tooltip.left="'Clear & create new wallet'" class="pointer dropdown-item fw-normal "><i class="fas fa-trash"></i>New Wallet</span>
                    <span @click="handleImportMnemonic" v-tooltip.left="'Clear wallet & import a new wallet from Secret Words (Mnemonic)'" class="pointer dropdown-item fw-normal "><i class="fas fa-file-import"></i>Import Secret Phrase</span>
                    <div class="dropdown-divider"></div>
                    <span @click="handleExportWallet" v-tooltip.left="'Export your wallet to your computer'" class="pointer dropdown-item fw-normal "><i class="fas fa-download"></i>Export Wallet</span>
                    <span @click="handleImportWallet" v-tooltip.left="'Import a pandora wallet from your computer'" class="pointer dropdown-item fw-normal "><i class="fas fa-upload"></i>Import Wallet</span>
                    <template v-if="encrypted">
                        <div class="dropdown-divider"></div>
                        <span @click="handleLogout" v-tooltip.left="'Return to the password screen'" class="pointer dropdown-item fw-normal "><i class="fas fa-sign-out-alt"></i>  Logout</span>
                    </template>
                </div>
            </div>
        </div>

    </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon"
import UtilsHelper from "src/utils/utils-helper";
import FileSaver from 'file-saver'
import consts from "consts/consts";

const {version} = PandoraPay.enums.wallet.address;

export default {

    components: {AccountIdenticon},

    data(){
        return {
            allowClose: false,
        }
    },

    computed: {

        walletAddress(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey];
        },

        walletAddresses(){
            return this.$store.state.wallet.addresses;
        },

        mainPublicKey(){
            return this.$store.state.wallet.mainPublicKey;
        },

        encrypted(){
            return this.$store.state.wallet.isEncrypted;
        }

    },

    methods:{

        handleViewAccount(){
            this.$router.push('/address/'+this.walletAddress.addressEncoded)
        },

      handleCreateNewAddress(){
          return this.$emit('showCreateNewAddress')
        },

        setMainPublicKey(publicKey){
            return this.$store.commit('setMainPublicKey', publicKey );
        },

        handleViewMnemonic(){
            return this.$emit('viewMnemonic')
        },

        handleNewWallet(){
          return this.$emit('newWallet')
        },

        handleImportMnemonic(){
          return this.$emit('importMnemonic')
        },

        async handleLogout(){

            try{
                const out = await PandoraPay.wallet.manager.encryption.logoutWallet();
                if (!out) throw "logout was not true"

                this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `You have been logged out!`,
                    text: `You have been logged out. You need to login with the password to access your wallet.`,
                });

            }catch(err){
                console.error(err)
            }

        },

        handleImportAccount(){
            return this.$emit('showImportAccount');
        },

        handleImportAccountSecretKey(){
            return this.$emit('showImportAccountSecretKey');
        },

        async handleExportWallet(){
            if ( typeof Blob === "undefined")
                return this.$store.dispatch('addToast', {
                    type: 'error',
                    title: `Blob is not supported by your Browser`,
                    text: `Update your browser`,
                })

            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            const jsonData = await PandoraPay.wallet.manager.exportWalletJSON(  password );
            if (!jsonData) return false;

            const json = MyTextDecode(jsonData)

            const fileName = consts.name+"_"+this.walletAddress.addressEncoded + ".pandorawallet";

            const file = new Blob([json], {type: "application/json;charset=utf-8"});
            FileSaver.saveAs(file, fileName);

            return this.$store.dispatch('addToast', {
                type: 'success',
                title: `Wallet has been saved on your machine`,
                text: `The wallet has been saved in the downloads folder.`,
            });
        },

        handleImportWallet(){
          return this.$emit('showImportWallet')
        },

        copyAddress( walletAddress ){

            let addr = this.$store.getters.addressDisplay(walletAddress)

            this.$copyText(addr).then(
                e => this.$store.dispatch('addToast',{
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `Address ${addr} copied to clipboard`,
                }),
                e => this.$store.dispatch('addToast',{
                    type: 'error',
                    title: `Clipboard failed`,
                    text: `Failed to copy to clipboard`,
                })
            )
        }

    }

}
</script>

<style scoped>

    .dropdown-menu{
      margin-top: 10px;
      right: -2.5625rem !important;
    }

    .dropdown-menu-notification{
        min-width: 16.4rem;
    }

    .notification{
        display: block;
    }

    .address{
        display: grid;
        grid-template-columns: 32px 160px 30px;
        grid-column-gap: 10px;
        text-align: left;
    }

    .dropdown-item i{
        margin-right: 5px;
    }

    .account-title span,
    .account-tools span, .account-tools i{
        display: block;
    }

    .account-tools{
        float: right;
    }

</style>
