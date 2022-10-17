<template>

  <layout>

    <layout-title icon="fas fa-file-invoice-dollar" title="Explorer Asset">View a specific asset.</layout-title>

    <div class="card mb-3">
      <div class="card-header bg-light">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="mb-0 text-truncate">Asset Explorer {{ $strings.base64ToHex(hash) }} </h5>
          </div>
        </div>
      </div>
      <div class="card-body p-3 fs--1">

        <alert-box v-if="error" type="error">{{ error }}</alert-box>

        <div v-if="!loaded" class="py-3 text-center">
          <loading-spinner class="fs-2"/>
        </div>
        <template v-else-if="asset">

          <div class="row pb-2">
            <span class="col-5 col-sm-3 text-truncate">Identicon</span>
            <span class="col-7 col-sm-9 text-truncate">
              <identicon v-if="asset.hash" :hash="asset.hash" size="21" outer-size="7" :uri="`/explorer/asset/${$strings.base64ToHex(asset.hash)}`"/>
            </span>
          </div>
          <div class="row pt-2 pb-2 bg-light">
            <span class="col-5 col-sm-3 text-truncate">Name</span>
            <span class="col-7 col-sm-9 text-truncate">{{ asset.name }}</span>
          </div>
          <div class="row pt-2 pb-2">
            <span class="col-5 col-sm-3 text-truncate">Ticker</span>
            <span class="col-7 col-sm-9 text-truncate">{{ asset.identification }}</span>
          </div>
          <div class="row pt-2 pb-2 bg-light">
            <span class="col-5 col-sm-3 text-truncate">Hash</span>
            <span class="col-7 col-sm-9 text-truncate">
              <router-link :to="`/explorer/asset/${$strings.base64ToHex(asset.hash)}`">{{ $strings.base64ToHex(asset.hash) }}</router-link>
            </span>
          </div>
          <div class="row pt-2 pb-2">
            <span class="col-5 col-sm-3 text-truncate">Description</span>
            <span class="col-7 col-sm-9 text-truncate">{{ asset.description }}</span>
          </div>
          <div class="row pt-2 pb-2 bg-light">
            <span class="col-5 col-sm-3 text-truncate">Decimal Separator</span>
            <span class="col-7 col-sm-9 text-truncate">{{ asset.decimalSeparator }}</span>
          </div>
          <div class="row pt-2 pb-2">
            <span class="col-5 col-sm-3 text-truncate">Max Supply</span>
            <span class="col-7 col-sm-9 text-truncate">{{ maxSupply }}</span>
          </div>
          <div class="row pt-2 pb-2 bg-light">
            <span class="col-5 col-sm-3 text-truncate">Supply</span>
            <span class="col-7 col-sm-9 text-truncate">{{ supply }}</span>
          </div>
          <div class="row pt-2 pb-2">
            <span class="col-5 col-sm-3 text-truncate">Update Key</span>
            <span class="col-7 col-sm-9 text-truncate">{{ asset.updatePublicKey }}</span>
          </div>
          <div class="row pt-2 pb-2 bg-light">
            <span class="col-5 col-sm-3 text-truncate">Supply Key</span>
            <span class="col-7 col-sm-9 text-truncate">{{ asset.supplyPublicKey }}</span>
          </div>

        </template>

      </div>
      <div class="card-footer bg-light g-0 d-block p-3">
        <loading-button :disabled="!asset" :submit="showAssetJSON" text="" icon="fas fa-file"
                        tooltip="Show JSON block" class-custom="btn btn-falcon-default rounded-pill me-1 mb-1 cursor-pointer"/>
      </div>
    </div>

  </layout>

</template>

<script>
import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import LoadingSpinner from "src/components/utils/loading-spinner";
import Identicon from "src/components/utils/identicon";
import AlertBox from "src/components/utils/alert-box"
import Decimal from 'decimal.js';
import LoadingButton from "src/components/utils/loading-button"

export default {

  components: {Layout, LoadingSpinner, Identicon, AlertBox, LayoutTitle, LoadingButton},

  data() {
    return {
      loaded: false,

      error: '',
    }
  },

  computed: {
    query() {
      return this.$route.params.hash || '';
    },
    hash() {
      if (this.query && this.query.length === 40) return Buffer.from(this.query, "hex").toString("base64")
    },
    asset() {
      return this.$store.state.assets.list[this.hash];
    },
    maxSupply() {
      return (this.asset.maxSupply || new Decimal(0)).div(new Decimal(10).pow(this.asset.decimalSeparator))
    },
    supply() {
      return (this.asset.supply || new Decimal(0)).div(new Decimal(10).pow(this.asset.decimalSeparator))
    },

  },

  methods: {

    async loadAsset() {

      try {
        this.loaded = false

        if (!this.hash) throw 'Asset hash was not specified';

        await this.$store.state.blockchain.syncPromise;

        await this.$store.dispatch('getAssetByHash', this.hash);

      } catch (err) {
        this.error = err.toString()
      } finally {
        this.loaded = true
      }

    },
    showAssetJSON() {
      return this.$store.state.page.inputModal.showModal({ title:"ASSET JSON", data: JSONStringify(this.asset, null, 2),
        textarea: { allowEdit:false, class:"form-control-sm fs--2", rows: 15 }, button: null })
    },

  },


  watch: {
    '$route'(to, from) {
      return this.loadAsset();
    }
  },

  mounted() {
    return this.loadAsset();
  }


}

</script>

<style scoped>
</style>
