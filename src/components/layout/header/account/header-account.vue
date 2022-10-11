<template>

  <div class="account" v-if="walletAddress">

    <div class="cursor-pointer unselectable" @click.stop="toggleMenu">
      <account-identicon :address="$store.getters.addressDisplay(this.walletAddress)" size="21" outer-size="7"
                         :disable-route="true" :show-tooltip="!menuOpen"/>
      <i class="right-float chevron-down fas fa-chevron-down"></i>
    </div>

    <div class="menu">
      <header-account-dropdown-menu v-if="menuOpen" @showCreateNewAddress="showCreateNewAddress"
                                    @showImportAccount="showImportAccount" @showImportAccountSecretKey="showImportAccountSecretKey"
                                    @showImportWallet="showImportWallet"/>
    </div>

    <import-account-modal ref="refImportAccountModal"/>
    <import-account-secret-key-modal ref="refImportAccountSecretKeyModal"/>
    <create-new-address-modal ref="refCreateNewAddressModal"/>
    <import-wallet-modal ref="refImportWalletModal"/>

  </div>

</template>

<script>

import HeaderAccountDropdownMenu from "./header-account-dropdown-menu"
import AccountIdenticon from "src/components/wallet/account/account-identicon"
import ImportAccountModal from "src/components/wallet/account/import-account.modal"
import ImportAccountSecretKeyModal from "src/components/wallet/account/import-account-secret-key.modal"
import CreateNewAddressModal from "src/components/wallet/account/create-new-address.modal"
import ImportWalletModal from "src/components/wallet/import-wallet.modal";

export default {

  components: {
    HeaderAccountDropdownMenu, AccountIdenticon, ImportAccountModal,
    ImportAccountSecretKeyModal, CreateNewAddressModal, ImportWalletModal
  },

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

    showImportAccount() {
      return this.$refs.refImportAccountModal.showModal();
    },

    showImportAccountSecretKey() {
      return this.$refs.refImportAccountSecretKeyModal.showModal();
    },

    showCreateNewAddress() {
      return this.$refs.refCreateNewAddressModal.showModal();
    },

    showImportWallet() {
      return this.$refs.refImportWalletModal.showModal();
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
