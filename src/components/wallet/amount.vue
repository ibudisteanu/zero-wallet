<template>
  <span>
    <loading-spinner v-if="!assetInfo && decimalSeparator === null"/>
    <template v-else>
      <span :class="valueClass">{{ sign }}{{ amount }}</span>
      <router-link v-if="assetInfo && showAsset" :to="`/explorer/asset/${$strings.base64ToHex(asset)}`" :class="`${assetClass} ps-1`">
        {{ assetInfo.identification }}
      </router-link>
    </template>
  </span>
</template>

<script>
import LoadingSpinner from "src/components/utils/loading-spinner";
export default {

  components: {LoadingSpinner},

  props: {
    asset: {default: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64},
    value: {default: () => Decimal_0},
    sign: {default: ""},
    showAsset: {default: true},
    decimalSeparator: {default: null},
    valueClass: {default: ""},
    assetClass: {default: ""}
  },

  computed: {
    assetInfo() {
      if (this.decimalSeparator !== null) return null
      return this.$store.getters.getAsset(this.asset);
    },
    usedDecimalSeparator(){
      if (this.decimalSeparator !== null) return this.decimalSeparator
      if (this.assetInfo) return this.assetInfo.decimalSeparator
      return Decimal_1
    },
    amount() {
      const value = this.value || Decimal_0
      return this.$strings.formatMoney(value.div( Decimal_10.pow(this.usedDecimalSeparator)).toString(), this.usedDecimalSeparator.toNumber() )
    },

  },

  watch: {
    asset: {
      immediate: true,
      handler: function (to, from) {
        if (to === from) return
        if (to) this.$store.dispatch('getAssetByHash', to)
      }
    }
  }

}
</script>
