<template>

    <div>
        <ul class="dd-menu">

            <li>My accounts</li>

            <li v-for="(address, index) in addresses"
                :class="`address ${ address.publicKeyHash === mainPublicKeyHash  ? 'focused' : ''} ` "
                :key="`header-account-dropdown-li-${index}`">

                <account-identicon :identicon="address.identicon" :size="20" :outer-size="5" :version="address.version" />

                <div class="account-title pointer" @click="setMainPublicKeyHash(address.publicKeyHash)" >
                    <span>{{address.name}}</span>
                    <span class="gray">{{address.addressEncoded.substr(0, 15)+'...'}} </span>
                </div>
                <div>
                    <span class="gray" >{{address.mnemonicSequenceIndex ? '#'+address.mnemonicSequenceIndex : '&nbsp;'}}</span>
                    <i class="fa fa-copy pointer" v-tooltip.bottom="'Copy Address'" @click.stop="copyAddress( address)" />
                </div>

            </li>

            <li class="divider"></li>

            <li @click="createAccount" v-tooltip.left="'Create a new Address'" class="pointer"> <i class="fa fa-plus"></i> Create Account </li>
            <li @click="importAccount" v-tooltip.left="'Import an address from json file'" class="pointer"><i class="fa fa-upload"></i> Import Account (json)</li>
            <li @click="importPrivateKey" v-tooltip.left="'Import an address from Private Key'" class="pointer"><i class="fa fa-upload"></i> Import Private Key</li>
            <li class="divider"></li>
            <li @click="viewMnemonic" v-tooltip.left="'Show your Secret Seed Words'" class="pointer"><i class="fa fa-key"></i>  View Seed Words</li>
            <li v-if="encrypted" @click="logout" class="pointer"><i class="fa fa-sign-out-alt"></i>  Logout</li>
        </ul>


    </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon"
const {version} = PandoraPay.enums.wallet.address;

export default {

    components: {AccountIdenticon},

    data(){
        return {
            allowClose: false,
        }
    },

    computed: {

        addresses(){
            return this.$store.state.wallet.addresses;
        },

        mainPublicKeyHash(){
            return this.$store.state.wallet.mainPublicKeyHash;
        },

        encrypted(){
            return this.$store.state.wallet.encrypted;
        }

    },

    methods:{

        async createAccount(){

            const account = await this.$store.state.page.refAccountTypeModal.showModal();
            if (account.selectedType === -1) return;

            try{

                this.$store.state.page.refLoadingModal.showModal();

                const out = await PandoraPay.wallet.manager.addNewWalletAddress(account.selectedType);
                if (!out) throw "Result is false"

                this.$notify({
                    type: 'success',
                    title: 'Address has been added successfully',
                    text: 'A new address has been added and saved in your wallet'
                });

            }catch(err){
                this.$notify({
                    type: 'error',
                    title: 'Error creating an address',
                    text: 'An error was encountered: ' + err.toString()
                });
                console.error(err);
            }finally{
                this.$store.state.page.refLoadingModal.closeModal();
            }

        },

        setMainPublicKeyHash(publicKeyHash){
            return this.$store.commit('setMainPublicKeyHash', publicKeyHash );
        },

        viewMnemonic(){
            return this.$emit('viewMnemonic', true);
        },

        logout(){

            const out = PandoraPay.wallet.encryption.logoutEncryptionWallet();
            if (out)
                this.$notify({
                    type: 'success',
                    title: `You have been logged out!`,
                    text: `You have been logged out. You need to login with the password to access your wallet.`,
                });

        },

        importAccount(){
            return this.$emit('showImportAccount');
        },

        importPrivateKey(){
            return this.$emit('showImportPrivateKey');
        },

        copyAddress( address ){

            let addr;
            if (address.version === version.VERSION_TRANSPARENT) addr = address.addressEncoded;

            this.$copyText(addr).then( e =>
                this.$notify({
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `Address ${address.addressEncoded} copied to clipboard`,
                }),
                e =>
                this.$notify({
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

    .address{
        display: grid;
        grid-template-columns: 32px 1fr;
        grid-column-gap: 10px;
    }

    .focused{
        background-color: #edffec;
    }

    .dd-menu {
        left: -160px;

        position: absolute;
        top: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0;
        margin: 2px 0 0 0;
        box-shadow: 0 0 6px 0 rgba(0,0,0,0.1);
        background-color: #ffffff;
        list-style-type: none;

        z-index: 100;
    }

    .dd-menu li {
        width: 200px;
        display: grid;
        grid-template-columns: 30px 1fr 30px;
        grid-column-gap: 10px;

        padding: 10px 20px;
        white-space: nowrap;
    }


    .dd-menu li:hover {
        background-color: #f6f6f6;
    }

    .dd-menu li a {
        display: block;
        margin: -10px -20px;
        padding: 10px 20px;
    }

    .dd-menu li.divider{
        width: 100%;
        padding: 0;
        border-bottom: 1px solid #cccccc;
    }

    i{
        margin-right: 5px;
    }

    i:hover{
        color: #313131;
    }

</style>
