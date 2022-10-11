<template>

  <layout>

    <layout-title icon="fas fa-file-invoice-dollar" title="Assets">
      View the existing assets on the network.
    </layout-title>

    <div class="card mb-3">
      <div class="card-header bg-light">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="mb-0">Assets Explorer {{ ending ? ending : '' }}</h5>
          </div>
        </div>
      </div>
      <div class="card-body p-3 pt-0 ">
        <div class="card-body p-0">

          <alert-box class="w-100 mt-2" v-if="error" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''">
            {{ error }}
          </alert-box>

          <div v-if="!loaded" class="py-3 text-center">
            <loading-spinner class="fs-2"/>
          </div>
          <show-assets-info v-else id="assets" :assetsInfo="assetsInfo"/>

        </div>
        <div class="card-footer" v-if="loaded">
          <pagination class="py-0" :inverted="true" :count-per-page="countPerPage" :current="finalPage"
                      :total="pages" prefix="/explorer/assets/" suffix="#assets"></pagination>
        </div>
      </div>
    </div>

  </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import ShowAssetsInfo from "src/components/explorer/show-assets-info"
import LoadingButton from "src/components/utils/loading-button"
import AlertBox from "src/components/utils/alert-box"
import consts from "consts/consts";
import Pagination from "src/components/utils/pagination";
import LoadingSpinner from "src/components/utils/loading-spinner";
import Decimal from "decimal.js"
import UtilsHelper from "src/utils/utils-helper";

export default {

  components: {Pagination, Layout, ShowAssetsInfo, LoadingButton, AlertBox, LayoutTitle, LoadingSpinner},

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
      return consts.assetsInfoPagination
    },

    finalPage() {
      return (this.page !== null) ? this.page : this.pages
    },

    ending() {
      return this.$store.state.blockchain.assets;
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

    assetsInfo() {
      return this.$store.state.assetsInfo.listByHeight;
    },

  },

  methods: {

    async loadAssetsInfo() {
      try {
        this.loaded = false
        this.error = ''

        await this.$store.state.blockchain.syncPromise;

        this.$store.commit('setAssetsInfoAllowDownload', true)

        await this.$store.dispatch('getAssetsInfo', {
          start: this.starting,
          end: this.last,
          view: this.page !== null,
        })

      } catch (err) {
        this.error = err.toString()
      } finally {
        this.loaded = true
      }
    },

  },

  watch: {
    '$route'(to, from) {
      return this.loadAssetsInfo();
    }
  },

  mounted() {
    return this.loadAssetsInfo();
  },

  beforeUnmount() {
    this.$store.commit('setAssetsInfoAllowDownload', false)
  }
}

</script>

<style scoped>

</style>
