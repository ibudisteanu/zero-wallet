<template>

  <layout>

    <layout-title icon="fas fa-file-invoice-dollar" title="Receive funds">
      Generate your address to receive funds publicly.
    </layout-title>

    <account :address="walletAddress" title="Receive Funds"/>

  </layout>

</template>

<script>

import Account from "src/components/wallet/account/account"
import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"

export default {

  components: {Account, Layout, LayoutTitle},

  data() {
    return {}
  },

  methods: {},

  computed: {
    walletAddress() {
      return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey];
    }
  },

}
</script>

<style scoped>
</style>
