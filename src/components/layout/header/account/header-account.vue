<template>

    <div class="account" v-if="address">

        <div class="toggle" @click="toggleMenu" v-on-clickaway="closeMenu">
            <account-identicon :address="address.addressEncoded" :identicon="identicon" :size="20" :outer-size="7" :version="address.version" :disableRoute="true" />
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
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKeyHash];
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
            return this.$refs.refWalletSeedModal.showModal(  );
        },

        showImportAccount(){
            return this.$refs.refImportAccountModal.showModal( );
        },

        showImportPrivateKey(){
            return this.$refs.refImportPrivateKeyModal.showModal( );
        },

    },

}

</script>

<style scoped>

    .chevron-down{
        font-size: 10px;
    }

    .menu{
        position: absolute;
    }

    .toggle{
        cursor: pointer;
    }

</style>
