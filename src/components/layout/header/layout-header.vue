<template>

  <nav class="navbar navbar-light navbar-glass navbar-top navbar-expand">

    <button class="btn navbar-toggler-humburger-icon navbar-toggler me-1 me-sm-3" @click.stop="handleToggleLeftSidebar">
         <span class="navbar-toggle-icon">
            <span class="toggle-line"></span>
         </span>
    </button>

    <router-link class="navbar-brand me-1 me-sm-3" to="/">
      <div class="d-flex align-items-center">
        <img class="me-2" :src="require(`src/assets/logo-square${$store.state.settings.dark?'':''}.png`).default" :alt="title" width="40">
      </div>
    </router-link>

    <div class="menu-right">

      <div class="menu-right-item">
        <header-search-bar />
      </div>

      <div class="menu-right-item pointer" v-tooltip.bottom="`Switch theme`" @click="handleToggleDark">
        <i :class="`fas fa-${$store.state.settings.dark ?'sun':'moon'} nav-item-icon `"/>
      </div>

      <div class="menu-right-item pointer" style="min-width: 70px">
        <header-network ref="refHeaderNetwork" @closeOtherMenus="closeMenu"  />
      </div>

      <div class="menu-right-item" style="min-width: 55px">
        <header-account ref="refHeaderAccount" @closeOtherMenus="closeMenu"/>
      </div>
    </div>

  </nav>
</template>

<script>

import consts from "consts/consts"
import HeaderAccount from "./account/header-account"
import HeaderNetwork from "./network/header-network";
import HeaderSearchBar from "./search-bar/header-search-bar";

export default {

  components: {HeaderSearchBar, HeaderNetwork, HeaderAccount},

  data() {
    return {
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

    closeMenu() {
      this.$store.commit('setLeftSidebarShow', false)
      this.$refs.refHeaderAccount.closeMenu()
      this.$refs.refHeaderNetwork.closeMenu()
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

.menu-right{
  margin-left: auto;
  margin-right: 0;

  display: flex;
  flex-wrap: nowrap;
  align-items: center;

}

.menu-right .menu-right-item{
  padding-right: 10px;
}

</style>
