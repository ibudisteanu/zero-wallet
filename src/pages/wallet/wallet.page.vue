<template>
  <layout>

    <layout-title icon="fas fa-wallet" title="Wallet">
      Manage your entire wallet
    </layout-title>

    <wallet-settings/>
    <wallet-accounts-options/>

    <div class="card mb-3">
      <div class="card-header bg-light">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="mb-0">Accounts in wallet</h5>
          </div>
        </div>
      </div>
    </div>

    <div v-for="(walletAddr, index) in walletAddresses">
      <wallet-account :address="walletAddr"/>
    </div>

    <alert-box v-if="error" type="error">{{ error }}</alert-box>

  </layout>
</template>

<script>

import Layout from "src/components/layout/layout";
import LayoutTitle from "src/components/layout/layout-title";
import WalletSettings from "../../components/wallet/wallet-settings";
import AccountIdenticon from "../../components/wallet/account/account-identicon";
import LoadingSpinner from "../../components/utils/loading-spinner";
import WalletAccount from "../../components/wallet/account/wallet-account";
import AlertBox from "src/components/utils/alert-box"
import TransactionsPreview from "../../components/wallet/transactions/transactions-preview";
import PendingTransactionsPreview from "../../components/wallet/transactions/pending-transactions-preview";
import WaitAddress from "src/components/wallet/account/wait-address";
import WaitAccount from "../../components/wallet/account/wait-account";
import UtilsHelper from "src/utils/utils-helper";
import WalletAccountsOptions from "../../components/wallet/wallet-accounts-options";

export default {

  components: {
    WalletAccount, WaitAccount, WaitAddress, PendingTransactionsPreview, TransactionsPreview,
    Layout, AccountIdenticon, LoadingSpinner, AlertBox, LayoutTitle, WalletSettings, WalletAccountsOptions
  },

  data() {
    return {
      error: "",
    }
  },

  computed: {

    walletAddresses() {
      return this.$store.state.wallet.addresses;
    },

  },

  methods: {

  }
}
</script>

<style scoped>

</style>
