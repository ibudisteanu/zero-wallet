<template>

    <div class="account" v-if="address">

        <div class="toggle unselectable" @click.stop="toggleMenu" >
            <account-identicon :address="$store.getters.addressDisplay(this.address)" size="21" outer-size="7" :disable-route="true" :show-tooltip="!menuOpen" />
            <i class="right-float chevron-down fas fa-chevron-down"></i>
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
import AccountIdenticon from "src/components/wallet/account/account-identicon"
import WalletSeedModal from "src/components/wallet/seed/wallet-seed-modal"
import ImportAccountModal from "src/components/wallet/account/import-account.modal"
import ImportPrivateKeyModal from "src/components/wallet/account/import-private-key.modal"

export default {

    components: { HeaderAccountDropdownMenu, AccountIdenticon, WalletSeedModal, ImportAccountModal, ImportPrivateKeyModal },

    data(){
        return {
            menuOpen: false,
        }
    },

    computed: {

        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey];
        },

    },

    methods:{

        toggleMenu(){
            if (!this.menuOpen) this.$emit('closeOtherMenus')
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
