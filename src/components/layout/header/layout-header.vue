<template>

    <nav class="navbar navbar-light navbar-glass navbar-top navbar-expand">

        <button class="btn navbar-toggler-humburger-icon navbar-toggler me-1 me-sm-3"
                @click.stop="handleToggleLeftSidebar">
         <span class="navbar-toggle-icon">
            <span class="toggle-line"></span>
         </span>
        </button>

        <router-link class="navbar-brand me-1 me-sm-3" to="/">
            <div class="d-flex align-items-center">
                <img class="me-2" :src="require('src/assets/pandora-pay-logo-square.png').default" alt="" width="40">
            </div>
        </router-link>

        <ul class="navbar-nav navbar-nav-icons flex-row align-items-center">

            <li class="nav-item pointer" v-tooltip.bottom="`Switch theme`" @click="handleToggleDark">
                <i :class="`fas fa-${$store.state.settings.dark ?'sun':'moon'} nav-item-icon `"/>
            </li>

            <li class="nav-item pointer unselectable" v-tooltip.bottom="`${showNetworksMenu ? '' :'Select network'}`"
                @click.stop="handleToggleNetworksMenu">
                <i class="fas fa-globe-americas nav-item-icon"></i>
                <span class="badge badge-soft-success">{{ $store.state.network.networkName }}</span>
                <i class="fas fa-chevron-down"></i>

                <div :class="`dropdown-menu dropdown-menu-end py-0 ${showNetworksMenu ? 'show': ''}`">
                    <div class="bg-white rounded-2 py-2">
                        <a class="dropdown-item" href="#">MAIN Net</a>
                        <a class="dropdown-item" href="#">DEV Net</a>
                        <a class="dropdown-item" href="#">TEST Net</a>
                    </div>
                </div>

            </li>
            <li class="nav-item pr-0">
                <header-account ref="refHeaderAccount" @closeOtherMenus="closeMenu"/>
            </li>
        </ul>

    </nav>
</template>

<script>

import consts from "consts/consts"
import HeaderAccount from "./account/header-account"

export default {

    components: {HeaderAccount},

    data() {
        return {
            showNetworksMenu: false,
        }
    },

    computed: {
        title() {
            return consts.title;
        },
        faucetTestnetEnabled() {
            return this.$store.state.faucet.faucetTestnetEnabled
        }
    },

    methods: {

        handleToggleDark() {
            this.$store.commit('setDark', !this.$store.state.settings.dark)
        },
        handleToggleLeftSidebar() {
            if (!this.$store.state.page.leftSidebarShow) this.closeMenu()
            this.$store.commit('setLeftSidebarShow', !this.$store.state.page.leftSidebarShow)
        },
        handleToggleNetworksMenu() {
            if (!this.showNetworksMenu) this.closeMenu()
            this.showNetworksMenu = !this.showNetworksMenu
        },
        closeMenu() {
            this.$store.commit('setLeftSidebarShow', false)
            this.showNetworksMenu = false
            this.$refs.refHeaderAccount.closeMenu()
        }
    },

    mounted() {
        document.addEventListener('click', this.closeMenu)
    },
    beforeUnmount() {
        document.removeEventListener('click', this.closeMenu)
    }

}
</script>

<style scoped>

.navbar-nav {
    margin-left: auto;
    margin-right: 0;
}

.nav-item-icon {
    font-size: 16px;
}

.nav-item {
    padding-right: 10px;
}

.fa-chevron-down {
    font-size: 10px;
}

</style>
