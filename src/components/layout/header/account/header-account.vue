<template>

    <div class="account">

        <div class="toggle" @click="toggleMenu" v-on-clickaway="closeMenu">
            <account-identicon v-if="address" :identicon="identicon" :size="40" :outer-size="40" ></account-identicon>

            <i class="chevron-down fa fa-chevron-down"></i>
        </div>

        <div class="menu" >
            <header-account-dropdown-menu v-if="menuOpen" @viewMnemonic="viewMnemonic" />
        </div>

        <wallet-seed-modal ref="refWalletSeedModal" />
    </div>

</template>

<script>

import HeaderAccountDropdownMenu from "./header-account-dropdown-menu"
import { mixin as clickaway } from 'vue-clickaway';
import AccountIdenticon from "src/components/wallet/account/account-identicon"
import WalletSeedModal from "src/components/wallet/seed/wallet-seed-modal";

export default {

    components: { HeaderAccountDropdownMenu, AccountIdenticon, WalletSeedModal },
    mixins: [ clickaway ],

    data(){
        return {
            menuOpen: false,
        }
    },

    computed: {

        address(){
            return this.$store.state.addresses[this.$store.state.mainAddress];
        },

        identicon(){
            return this.address.identicon;
        }

    },

    methods:{

        toggleMenu(){
            this.menuOpen = !this.menuOpen;
        },

        closeMenu(){
            this.menuOpen = false;
        },

        async viewMnemonic(){

            const out = await global.apacache.wallet.encryption.decryptMnemonic();

            this.$refs.refWalletSeedModal.showModal( out.join(' ') );

        },

    },

}

</script>

<style scoped>


    .account{
        margin-left:auto;
        margin-right:0;
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