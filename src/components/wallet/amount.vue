<template>
  <span>
    <template v-if="getAsset">
      <span :class="valueClass">
        {{ getSign }} {{ amount }}
      </span>
      <router-link :to="`/explorer/asset/${$base64ToHex(asset)}`" :class="`${assetClass} ps-1`" v-if="showAsset">
        {{ getAsset.identification }}
      </router-link>
    </template>
    <template v-else>
      <loading-spinner/>
    </template>
  </span>
</template>

<script>
import LoadingSpinner from "src/components/utils/loading-spinner";
import Decimal from 'decimal.js';

export default {

  components: {LoadingSpinner},

  props: {
    asset: {default: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64},
    value: {default: () => new Decimal(0)},
    sign: {default: false},
    showPlusSign: {default: false},
    showAsset: {default: true},
    valueClass: {default: ""},
    assetClass: {default: ""}
  },

  computed: {
    getAsset() {
      return this.$store.getters.getAsset(this.asset);
    },

    amount() {
      const value = this.value || new Decimal(0)
      return this.$formatMoney(value.div(new Decimal(10).pow(this.getAsset.decimalSeparator)).toString(), this.getAsset.decimalSeparator)
    },
    getSign() {
      if (!this.sign) return '-'
      if (this.showPlusSign) return '+'
      return ''
    },
  },

  watch: {
    asset: {
      immediate: true,
      handler: function (to, from) {
        if (to === from) return
        if (to)
          this.$store.dispatch('getAssetByHash', to)
      }
    }
  }

}
</script>

<style scoped>
</style>
