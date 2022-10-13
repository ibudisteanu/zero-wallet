<template>

  <div>

    <div class="d-none d-md-flex row bg-200 text-900 py-2 fs--1 fw-semi-bold" style="text-align: center">
      <span v-tooltip.bottom="'Tx Hash'" class="d-none d-md-block col-md-1 text-truncate">
        <i class="fas fa-hashtag"/>
      </span>
      <span v-tooltip.bottom="'Tx Time'" class="d-none d-md-block col-md-1 text-truncate">
        <i class="fas fa-clock"/>
      </span>
      <span v-tooltip.bottom="'Tx Confirmations'" class="d-none d-md-block col-md-1 text-truncate">
        <i class="fas fa-check"/>
      </span>
      <span v-tooltip.bottom="'Tx Fees'" class="d-none d-md-block col-md-1 text-truncate">
        <i class="fas fa-coins"/>
      </span>
      <span v-tooltip.bottom="'Tx Type'" class="d-none d-md-block col-md-1 text-truncate">
        <i class="fas fa-credit-card"/>
      </span>
      <span v-tooltip.bottom="'Tx Data'" class="d-none d-md-block col-md-2 text-truncate">
        <i class="fas fa-users"/>
      </span>
      <span v-tooltip.bottom="'Tx Message (memo)'" class="d-none d-md-block col-md-2 text-truncate">
        <i class="fas fa-comment-dots"/>
      </span>
      <span v-tooltip.bottom="'Tx Amount'" class="d-none d-md-block col-md-2 text-truncate">
        <i class="fas fa-dollar-sign"/>
      </span>
      <span v-tooltip.bottom="'Tx Recipient'" class="d-none d-md-block col-md-1 text-truncate">
        <i class="fas fa-user"/>
      </span>
    </div>

    <div id="transactions"/>

    <div v-for="(tx, key) in transactions" :key="`show-transaction-${key}`">
      <show-transaction-preview :class="`row py-2 fs--1 ${key % 2 === 1 ?'bg-light':''}`" :txHash="tx" :public-key="publicKey"/>
    </div>

  </div>

</template>

<script>

import ShowTransactionPreview from "./show-transaction-preview";

export default {

  components: {ShowTransactionPreview},

  props: {
    transactions: {default: null},
    publicKey: {default: ""},
  },

  methods: {},

  watch: {
    transactions: {
      immediate: true,
      handler: function (newVal, oldVal) {
        if (newVal === oldVal) return
        this.$store.commit('updateViewTransactionsPreviewHashes', {
          txsHashes: oldVal && newVal ? oldVal.filter(hash => newVal.indexOf(hash) === -1) : oldVal,
          insert: false
        })
        this.$store.commit('updateViewTransactionsPreviewHashes', {
          txsHashes: newVal && oldVal ? newVal.filter(hash => oldVal.indexOf(hash) === -1) : newVal,
          insert: true
        })
      }
    },
  },

  beforeUnmount() {
    this.$store.commit('updateViewTransactionsPreviewHashes', {txsHashes: this.transactions, insert: false})
  }

}
</script>

<style scoped>
</style>
