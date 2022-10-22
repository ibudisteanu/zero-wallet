<template>

  <div class="card mb-3  overflow-hidden">
    <div class="card-header bg-light">
      <div class="row align-items-center">
        <div class="col">
          <h5 class="mb-0">
            Balances
            <div v-if="isLoading" class="py-3 text-center">
              <loading-spinner/>
            </div>
          </h5>
        </div>
      </div>
    </div>
    <div class="card-body p-0" v-if="!isLoading && isFound">
      <div class="row g-0 align-items-center py-2 position-relative border-bottom border-200 text-center">

        <h4 v-if="!account.accounts || !account.accounts.length" class="fs-0 pt-2">Empty!</h4>
        <balance v-else v-for="(accountBalance, index) in account.accounts"
                 :key="`balance-asset-${index}`"
                 :balance="accountBalance.balance"
                 :asset="account.accounts[index].asset"
                 :can-be-decrypted="$store.getters.walletContains(publicKey)"
                 :public-key="publicKey"
                 version="zether">
        </balance>

        <template v-if="account.plainAccount">
          <h5 class="text-800 fs-0 pt-4">Unclaimed</h5>
          <balance :key="`delegated-balance`" :balance="account.plainAccount.unclaimed" version="transparent"/>
        </template>

      </div>
    </div>
  </div>

</template>

<script>
import LoadingSpinner from "src/components/utils/loading-spinner";
import Balance from "./balance"
import AccountIdenticon from "../account/account-identicon";

export default {

  components: {AccountIdenticon, LoadingSpinner, Balance},

  props: {
    publicKey: {default: ""}
  },

  computed: {

    account() {
      return this.$store.state.accounts.list[this.publicKey]
    },

    isLoading() {
      return this.account === undefined
    },

    isFound() {
      return this.account !== null
    },

    isEmpty() {
      return !this.account.accounts.length
    }

  },


}
</script>

<style scoped>
</style>
