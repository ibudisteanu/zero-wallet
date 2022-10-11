<template>

  <layout>

    <layout-title icon="fas fa-list-ol" title="Mem pool">
      View the latest transactions that are in pending for the next blocks.
    </layout-title>

    <div class="card mb-3">
      <div class="card-header bg-light" id="mempool">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="mb-0">Mem pool</h5>
            <div class="subtitle">
              <h6>Pending Transactions: {{ mempoolCount }}</h6>
              <i class="fas fa-sync cursor-pointer " @click="()=>downloadMempool()" v-tooltip.bottom="`Download again the mempool`"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body p-3">

        <div v-if="!loaded" class="py-3 text-center">
          <loading-spinner class="fs-2"/>
        </div>
        <template v-else>
          <div v-for="(  hash, key ) in pendingTxs"
               :class="`row g-0  py-2  border-bottom border-200 d-flex ${key % 2 === 1 ?'bg-light':''}`"
               style="text-align: center" :key="`pending_${hash}`">

            <router-link :to="`/explorer/tx/${$base64ToHex(hash)}`">
              <span class="d-block text-truncate fs--1"> {{ $base64ToHex(hash) }} </span>
            </router-link>
          </div>
          <pagination class="right pt-2" :inverted="true" :count-per-page="countPerPage" :current="finalPage"
                      :total="pages" prefix="/explorer/mempool/" suffix="#mempool"/>
        </template>

      </div>
    </div>

  </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import Pagination from "src/components/utils/pagination"
import consts from "consts/consts"
import LoadingSpinner from "src/components/utils/loading-spinner";
import Decimal from "decimal.js";
import UtilsHelper from "src/utils/utils-helper";

export default {

  components: {Layout, LayoutTitle, Pagination, LoadingSpinner},

  data() {
    return {
      error: '',
      loaded: false,
    }
  },

  computed: {
    page() {
      return UtilsHelper.getPage(this.$route.params.page)
    },
    countPerPage() {
      return consts.mempoolTxsPagination
    },

    finalPage() {
      return (this.page !== null) ? this.page : this.pages
    },

    mempoolCount() {
      return this.$store.state.mempool.count
    },
    pendingTxs() {
      return Object.keys(this.$store.state.mempool.list)
    },
    pages() {
      return Decimal.max(0, this.mempoolCount.minus(1).div(this.countPerPage).floor())
    }
  },

  methods: {

    async downloadMempool(page = this.page) {
      try {

        this.loaded = false
        this.error = ""

        await this.$store.state.blockchain.syncPromise;
        await this.$store.dispatch('downloadMempool', page);

      } catch (err) {
        this.error = err.toString()
      } finally {
        this.loaded = true
      }
    },

  },

  watch: {
    '$route'(to, from) {
      return this.downloadMempool();
    }
  },

  mounted() {
    return this.downloadMempool();
  },


}

</script>

<style scoped>
.subtitle i, .subtitle h6 {
  display: inline-block;
}

.subtitle i {
  padding-left: 10px;
}
</style>
