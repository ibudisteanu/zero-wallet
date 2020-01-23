<template>

    <div>
        <ul class="dd-menu">

            <li>My accounts</li>

            <li v-for="(address) in addresses" :class="`address ${ address.address === mainAddress  ? 'focused' : ''} ` " @click="setMainAddress(address.address)" >
                <account-identicon :identicon="address.identicon" :size="20" :outer-size="5" > </account-identicon>

                <div>
                    <span>{{address.name}}</span> <span class="disabled right-float" >{{address.mnemonicSequenceIndex ? '#'+address.mnemonicSequenceIndex : ''}}</span><br/>
                    <span class="disabled">{{address.address.substr(0, 15)+'...'}} <i class="fa fa-copy pointer"  @click="copyAddress(address)" /> </span>
                </div>

            </li>

            <li class="divider"></li>

            <li @click="createAccount"> <i class="fa fa-plus"></i> Create account </li>
            <li @click="importAccount"><i class="fa fa-upload"></i> Import account</li>
            <li @click="importPrivateKey"><i class="fa fa-upload"></i> Import Private Key</li>
            <li class="divider"></li>
            <li @click="viewMnemonic"><i class="fa fa-key"></i>  View Seed Words</li>
            <li v-if="encrypted" @click="logout"><i class="fa fa-sign-out-alt"></i>  Logout</li>
        </ul>


    </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon"

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

        mainAddress(){
            return this.$store.state.wallet.mainAddress;
        },

        encrypted(){
            return this.$store.state.wallet.encrypted;
        }

    },

    methods:{

        async createAccount(){

            this.$store.commit('setIsLoading', true);

            try{

                const out = await global.apacache.wallet.manager.createNewAddress();
                if (out)
                    this.$notify({
                        type: 'success',
                        title: 'Address has been added successfully',
                        text: 'A new address has been added and saved in your wallet'
                    });

            }catch(err){

            }

            this.$store.commit('setIsLoading', false);

        },

        setMainAddress(address){

            return this.$store.commit('setMainAddress', address );

        },

        viewMnemonic(){

            return this.$emit('viewMnemonic', true);

        },

        logout(){

            const out = global.apacache.wallet.encryption.logoutEncryptionWallet();
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

        copyAddress(address){
            this.$copyText(address.address).then( (e) => {
                this.$notify({
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `Address ${address.address} copied to clipboard`,
                });
            }, (e) => {
                this.$notify({
                    type: 'error',
                    title: `Clipboard failed`,
                    text: `Failed to copy to clipboard`,
                });
            })
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
        top: 80px;
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
        padding: 10px 20px;
        cursor: pointer;
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