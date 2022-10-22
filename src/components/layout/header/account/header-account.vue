<template>

  <div class="account" v-if="walletAddress">

    <div class="cursor-pointer unselectable" @click.stop="toggleMenu">
      <account-identicon :address="$store.getters.addressDisplay(this.walletAddress)" size="21" outer-size="7"
                         :disable-route="true" :show-tooltip="!menuOpen"/>
      <i class="right-float chevron-down fas fa-chevron-down"></i>
    </div>

    <div class="menu">
      <header-account-dropdown-menu v-if="menuOpen" />
    </div>

  </div>

</template>

<script>

import HeaderAccountDropdownMenu from "./header-account-dropdown-menu"
import AccountIdenticon from "src/components/wallet/account/account-identicon"


export default {

  components: { HeaderAccountDropdownMenu, AccountIdenticon,},

  data() {
    return {
      menuOpen: false,
    }
  },

  computed: {

    walletAddress() {
      return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey];
    },

  },

  methods: {

    toggleMenu() {
      if (!this.menuOpen) this.$emit('closeOtherMenus')
      this.menuOpen = !this.menuOpen;
    },

    closeMenu() {
      this.menuOpen = false;
    },


  },

}

</script>

<style scoped>

.chevron-down {
  font-size: 10px;
}

.menu {
  position: absolute;
}


</style>
