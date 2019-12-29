<template>

    <div class="account" @click="toggleMenu" v-on-clickaway="closeMenu">

        <account-identicon :identicon="identicon" :size="40" :outer-size="40" ></account-identicon>

        <i class="fa fa-chevron-down"></i>

        <div class="menu" >
            <header-account-dropdown-menu v-if="menuOpen"  />
        </div>

    </div>

</template>

<script>

import HeaderAccountDropdownMenu from "./header-account-dropdown-menu"
import { mixin as clickaway } from 'vue-clickaway';
import AccountIdenticon from "src/components/wallet/account/account-identicon"

export default {

    components: { HeaderAccountDropdownMenu, AccountIdenticon },
    mixins: [ clickaway ],

    data(){
        return {
            menuOpen: false,
        }
    },

    computed: {

        identicon(){
            return this.$store.state.addresses[this.$store.state.mainAddress].identicon;
        }

    },

    methods:{

        toggleMenu(){
            this.menuOpen = !this.menuOpen;
        },

        closeMenu(){
            this.menuOpen = false;
        }



    },

}

</script>

<style scoped>


    .account{
        margin-left:auto;
        margin-right:0;
        cursor: pointer;
    }

    .menu{
        position: absolute;
    }

</style>