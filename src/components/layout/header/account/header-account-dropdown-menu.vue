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
                    <div v-for="(address, index) in addresses" :class="`notification notification-flush notification-unread ${ address.publicKey === mainPublicKey  ? 'fw-black' : ''} ` "
                         :key="`address-${index}`">
                            <div class="notification-body address">
                                <account-identicon :address="address.addressEncoded" size="21" outer-size="7"  :disable-route="true" />
                                <div class="account-title pointer " @click="setMainPublicKey(address.publicKey)">
                                    <span class="fw-semi-bold text-truncate">{{address.name}}</span>
                                    <span class="fw-normal text-truncate">{{$store.getters.addressDisplay(address)}} </span>
                                </div>
                                <div class="account-tools">
                                    <span class="fw-light" >{{ (address.seedIndex !== undefined) ? '#'+address.seedIndex : '&nbsp;'}}</span>
                                    <i class="fas fa-copy pointer " v-tooltip.bottom="'Copy Address'" @click.stop="copyAddress( address)" />
                                </div>
                            </div>
                    </div>
                </div>
                <div class="list-group-item">
                    <div class="list-group-title border-bottom">Operations:</div>
                    <span @click="handleViewAccount" v-tooltip.left="'View account'" class="pointer dropdown-item "> <i class="fas fa-hand-pointer "></i> View account </span>
                    <span @click="handleCreateAccount" v-tooltip.left="'Create a new Address'" class="pointer dropdown-item fw-normal "> <i class="fas fa-plus"></i> Create Account </span>
                    <span @click="handleImportAccount" v-tooltip.left="'Import an address from json file'" class="pointer dropdown-item fw-normal "><i class="fas fa-upload"></i> Import Account (json)</span>
                    <span @click="handleImportPrivateKey" v-tooltip.left="'Import an address from Private Key'" class="pointer dropdown-item fw-normal "><i class="fas fa-upload"></i> Import Private Key</span>
                    <div class="dropdown-divider"></div>
                    <span @click="handleViewMnemonic" v-tooltip.left="'Show your Secret Seed Words'" class="pointer dropdown-item fw-normal "><i class="fas fa-key"></i>View Secret Phrase</span>
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

        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey];
        },

        addresses(){
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
            this.$router.push('/address/'+this.address.addressEncoded)
        },

        async handleCreateAccount(){

            try{

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                this.$store.state.page.refLoadingModal.showModal();

                await UtilsHelper.sleep(50 )

                const out = await PandoraPay.wallet.manager.addNewWalletAddress(password);
                if (!out) throw "Result is false"

                this.$store.dispatch('addToast',{
                    type: 'success',
                    title: 'Address has been added successfully',
                    text: 'A new address has been added and saved in your wallet'
                });

            }catch(err){
                this.$store.dispatch('addToast',{
                    type: 'error',
                    title: 'Error creating an address',
                    text: 'An error was encountered: ' + err.toString()
                });
                console.error(err);
            }finally{
                this.$store.state.page.refLoadingModal.closeModal();
            }

        },

        setMainPublicKey(publicKey){
            return this.$store.commit('setMainPublicKey', publicKey );
        },

        handleViewMnemonic(){
            return this.$emit('viewMnemonic')
        },

        async handleLogout(){

            try{
                const out = await PandoraPay.wallet.manager.encryption.logoutWallet();
                if (!out) throw "logout was not true"

                await this.$store.dispatch('addToast', {
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

        handleImportPrivateKey(){
            return this.$emit('showImportPrivateKey');
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

            const jsonData = await PandoraPay.wallet.exportWalletJSON(  password );
            if (!jsonData) return false;

            const json = MyTextDecode(jsonData)

            const fileName = consts.name+"_"+this.address.addressEncoded + ".pandorawallet";

            const file = new Blob([json], {type: "application/json;charset=utf-8"});
            FileSaver.saveAs(file, fileName);

            return this.$store.dispatch('addToast', {
                type: 'success',
                title: `Wallet has been saved on your machine`,
                text: `The wallet has been saved in the downloads folder.`,
            });
        },

        handleImportWallet(){

        },

        copyAddress( address ){

            let addr = this.$store.getters.addressDisplay(address)

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

    .dropdown-menu-notification{
        min-width: 16.4rem;
    }

    .navbar .dropdown-menu.dropdown-menu-end{
        right: -2.5625rem
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
