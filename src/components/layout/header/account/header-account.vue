<template>

    <div class="account" v-if="address">

        <div class="toggle" @click="toggleMenu" v-on-clickaway="closeMenu">
            <account-identicon :identicon="identicon" :size="40" :outer-size="10" :type="address.type" />

            <i class="right-float chevron-down fa fa-chevron-down"></i>
        </div>

        <div class="menu" >
            <header-account-dropdown-menu v-if="menuOpen" @viewMnemonic="viewMnemonic" @showImportAccount="showImportAccount" @showImportPrivateKey="showImportPrivateKey" />
        </div>

        <wallet-seed-modal ref="refWalletSeedModal" />
        <import-account-modal ref="refImportAccountModal" />
        <import-private-key-modal ref="refImportPrivateKeyModal" />

    </div>

</template>

<script>

import HeaderAccountDropdownMenu from "./header-account-dropdown-menu"
import { mixin as clickaway } from 'vue-clickaway'
import AccountIdenticon from "src/components/wallet/account/account-identicon"
import WalletSeedModal from "src/components/wallet/seed/wallet-seed-modal"
import ImportAccountModal from "src/components/wallet/account/import-account.modal"
import ImportPrivateKeyModal from "src/components/wallet/account/import-private-key.modal"

export default {

    components: { HeaderAccountDropdownMenu, AccountIdenticon, WalletSeedModal, ImportAccountModal, ImportPrivateKeyModal },

    mixins: [ clickaway ],

    data(){
        return {
            menuOpen: false,
        }
    },

    computed: {

        address(){
            return this.$store.state.addresses.list[this.$store.state.wallet.mainAddress];
        },

        identicon(){
            if (!this.address) return null;
            else return this.address.identicon;
        }

    },

    methods:{

        toggleMenu(){
            this.menuOpen = !this.menuOpen;
        },

        closeMenu(){
            this.menuOpen = false;
        },

        viewMnemonic(){
            this.$refs.refWalletSeedModal.showModal( );
        },

        showImportAccount(){
            this.$refs.refImportAccountModal.showModal( );
        },

        async showImportPrivateKey(){

            const account = await this.$store.state.page.refAccountTypeModal.showModal();
            if (account.selectedType === -1) return;

            this.$refs.refImportPrivateKeyModal.showModal( account.selectedType );
        },

    },

}

</script>

<style scoped>


    .account{
        width: 70px;
    }

    .chevron-down{
        position: relative;
        left: -10px;
    }

    .menu{
        position: absolute;
    }

    .toggle{
        cursor: pointer;
    }

</style>