<template>

  <div class="card mb-3 h-lg-100 overflow-hidden">
    <div class="card-header bg-light">
      <div class="row align-items-center">
        <div class="col">
          <h5 class="mb-0">
            Transactions
            <template v-if="!loaded">
              <loading-spinner/>
            </template>
            <template v-else>
              {{ ending }}
            </template>
          </h5>
        </div>
      </div>
    </div>
    <div class="card-body px-3 py-0" v-if="txs && transactions.length ">
      <show-transactions-preview :transactions="transactions" :public-key="publicKey"/>
    </div>
    <div class="card-footer bg-light g-0 d-block p-3" v-if="pages.gt(0)">
      <pagination class="right" :inverted="true" :count-per-page="countPerPage" :current="finalPage" :total="pages"
                  :prefix="`/address/${address.addressEncoded}/`" suffix="#transactions"/>
    </div>

    <alert-box v-if="error" type="error">{{ error }}</alert-box>

  </div>

</template>

<script>

import LoadingSpinner from "../../utils/loading-spinner";
import ShowTransactionsPreview from "src/components/explorer/tx-preview/show-transactions-preview"
import consts from "consts/consts";
import Pagination from "src/components/utils/pagination"
import AlertBox from "src/components/utils/alert-box"
import Decimal from "decimal.js"

export default {

  components: {LoadingSpinner, Pagination, ShowTransactionsPreview, AlertBox},

  props: {
    publicKey: {default: ""},
    page: {default: null},
  },

  data() {
    return {
      error: "",
      loaded: false,
    }
  },

  computed: {

    finalPage() {
      return (this.page !== null) ? this.page : this.pages
    },

    address() {
      return this.$store.state.addresses.list[this.publicKey]
    },

    txs() {
      return this.$store.state.accountsTxs.list[this.publicKey]
    },

    countPerPage() {
      return consts.addressTxsPagination
    },

    pages() {
      return Decimal.max(0, this.ending.minus(1).div(this.countPerPage).floor())
    },

    ending() {
      return this.txs ? this.txs.count : new Decimal(0)
    },

    starting() {
      return this.last.minus(this.countPerPage)
    },

    last() {
      const value = this.finalPage.plus(1).mul(this.countPerPage)
      if (this.txs) return Decimal.min(this.ending, value);
      else return value
    },

    transactions() {

      if (!this.txs) return []

      const txs = this.txs.hashes;

      const heights = []
      for (const heightStr in txs)
        heights.push(new Decimal(heightStr))

      heights.sort((a, b) => b.minus(a))

      console.log("transactions", this.starting.toString(), this.last.toString(), heights)

      return heights.filter(height => height.gte(this.starting) && height.lt(this.last)).map(height => txs[height]);
    },


  },

  methods: {
    async loadTransactions() {
      try {
        this.loaded = false
        this.error = ''

        await this.$store.state.blockchain.syncPromise;
        await this.$store.dispatch('downloadAccountTxs', {
          publicKey: this.publicKey,
          next: this.last,
          view: (this.page !== null)
        })

      } catch (err) {
        this.error = err.toString()
      } finally {
        this.loaded = true
      }
    }
  },

  watch: {
    publicKey(to, from) {
      if (to !== from) return this.loadTransactions()
    },
    page(to, from) {
      if (to !== from) return this.loadTransactions()
    },
  },

  mounted() {
    return this.loadTransactions();
  }


}
</script>

<style scoped>
</style>
