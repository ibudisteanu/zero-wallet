<template>


  <main :class="`main`">

    <warning-bar v-if="$store.getters.isTestnet"/>

    <div class="container" data-layout="container">

      <left-sidebar v-if="!disableLayout" ref="refSidebar" :style="`${$store.getters.isTestnet ? 'top: 50px' : ''}`"/>

      <div :class="`${disableLayout ? 'row flex-center min-vh-100 py-6' : 'content'}`">

        <layout-header v-if="!disableLayout"></layout-header>

        <slot/>

        <loading-modal ref="loadingModal"/>
        <input-modal ref="inputModal"/>
        <qr-code-modal ref="QRCodeModal"/>
        <qr-code-scanner-modal ref="QRCodeScannerModal"/>
        <testnet-faucet-modal ref="testnetFaucetModal"/>
        <wallet-password-modal ref="walletPasswordModal"/>
        <decrypt-balance-modal ref="decryptBalanceModal"/>
        <layout-footer v-if="!disableLayout"/>

      </div>

    </div>

    <toasts/>

  </main>

</template>

<script>

require('src/assets/common.css');

import LayoutHeader from "./header/layout-header";
import LayoutFooter from "./footer/layout-footer";
import LoadingModal from "./modals/loading.modal"
import TestnetFaucetModal from "./modals/testnet-faucet.modal"
import InputModal from "./modals/input-modal"
import WalletPasswordModal from "./modals/wallet-password.modal"
import DecryptBalanceModal from "./modals/decrypt-balance.modal"
import QrCodeModal from "./modals/qr-code.modal"
import LeftSidebar from "./left-sidebar/left-sidebar"
import WarningBar from "./header/warning-bar"
import Toasts from "./toasts/toasts"
import QrCodeScannerModal from "../utils/qr-code-scanner/qr-code-scanner.modal";

export default {

  components: {
    LeftSidebar, LayoutHeader, LayoutFooter, LoadingModal, WarningBar, QrCodeModal,
    TestnetFaucetModal, WalletPasswordModal, Toasts, QrCodeScannerModal, DecryptBalanceModal, InputModal,
  },

  props: {
    disableLayout: {default: false},
  },

  data() {
    return {}
  },

  computed: {},

  methods: {
    storeModals() {

      if (!this.$refs.decryptBalanceModal) return

      this.$store.commit('setModals', {
        loadingModal: this.$refs.loadingModal,
        inputModal: this.$refs.inputModal,
        QRCodeModal: this.$refs.QRCodeModal,
        QRCodeScannerModal: this.$refs.QRCodeScannerModal,
        testnetFaucetModal: this.$refs.testnetFaucetModal,
        walletPasswordModal: this.$refs.walletPasswordModal,
        decryptBalanceModal: this.$refs.decryptBalanceModal,
      })
    }
  },

  mounted() {
    this.storeModals()
  }

}

</script>


<style scoped>

@media (min-width: 576px) {
  .content {
    padding-bottom: 5.5875rem;
  }
}

</style>
