<template>

  <layout>

    <layout-title icon="fas fa-cubes" title="Blockchain">View the latest blocks.</layout-title>

    <div class="card mb-3">
      <div class="card-header bg-light">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="mb-0">Blockchain Explorer {{ ending ? ending : '' }}</h5>
          </div>
        </div>
      </div>
      <div class="card-body p-3 pt-0">
        <div class="card-body p-0">

          <alert-box v-if="error" class="w-100 mt-2" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''">
            {{ error }}
          </alert-box>

          <div v-if="!loaded" class="py-3 text-center">
            <loading-spinner class="fs-2"/>
          </div>
          <show-blocks-info v-else :blocksInfo="lastBlocksInfo"/>

        </div>

        <div class="card-footer" v-if="loaded">
          <pagination class="py-0" :inverted="true" :count-per-page="countPerPage" :current="finalPage"
                      :total="pages" prefix="/explorer/" suffix="#chain"/>
        </div>

      </div>
    </div>

  </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import ShowBlocksInfo from "src/components/explorer/show-blocks-info"
import Pagination from "src/components/utils/pagination"
import LoadingSpinner from "src/components/utils/loading-spinner";
import consts from "consts/consts"
import AlertBox from "src/components/utils/alert-box"
import Decimal from 'decimal.js';
import UtilsHelper from "src/utils/utils-helper"

export default {

  components: {Layout, Pagination, ShowBlocksInfo, LoadingSpinner, LayoutTitle, AlertBox},

  data() {
    return {
      error: '',
      loaded: false,
    }
  },

  computed: {

    page() {
      return this.$utils.getPage(this.$route.params.page)
    },

    countPerPage() {
      return consts.blocksInfoPagination
    },

    finalPage() {
      return (this.page !== null) ? this.page : this.pages
    },

    pages() {
      return Decimal.max(0, this.ending.minus(1).div(this.countPerPage).floor())
    },

    starting() {
      return this.last.minus(this.countPerPage)
    },

    last() {
      return Decimal.min(this.ending, this.finalPage.plus(1).mul(this.countPerPage));
    },

    ending() {
      return this.$store.state.blockchain.end;
    },

    lastBlocksInfo() {
      return this.$store.getters.blocksInfoSorted.filter(a => a.height.gte(this.starting) && a.height.lt(this.last));
    },

  },

  methods: {
    async loadBlocksInfo() {
      try {
        this.loaded = false
        this.error = ''

        await this.$store.state.blockchain.syncPromise;

        this.$store.commit('setBlocksInfoAllowDownload', true)

        await this.$store.dispatch('getBlocksInfo', {
          start: this.starting,
          end: this.last,
          view: this.page !== null,
        })

      } catch (err) {
        this.error = err.toString()
        console.error(err)
      } finally {
        this.loaded = true
      }
    }
  },

  watch: {
    '$route'(to, from) {
      return this.loadBlocksInfo();
    },
  },

  mounted() {
    return this.loadBlocksInfo();
  },

  beforeUnmount() {
    this.$store.commit('setBlocksInfoAllowDownload', false)
  }

}

</script>

<style scoped>
</style>
