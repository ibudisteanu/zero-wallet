<template>
  <div>
      <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">{{ text }} Amount</label>
      <loading-spinner v-if="!assetInfo"/>
      <template v-else>
        <i v-if="tooltip" class="fas fa-question ms-1" v-tooltip.bottom="tooltip"/>
        <input :class="`form-control ${validationError ? 'is-invalid' :''}`" type="number" v-model="amount"
               :disabled="!(initAmount === undefined || $store.state.settings.expert)" >
        <div v-if="validationError" class="invalid-feedback d-block">{{ validationError }}</div>
      </template>
  </div>
</template>

<script>
import LoadingSpinner from "../utils/loading-spinner";
export default {
  components: {LoadingSpinner},
  data() {
    return {
      amountBase: new Decimal(0),
      lastTo: null,
    }
  },

  props: {
    text: {default: ''},
    tooltip: {default: ''},
    asset: {default: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64},
    allowZero: {default: false,},
    initAmount: {default: undefined},
  },

  computed: {

    assetInfo() {
      return this.$store.getters.getAsset(this.asset);
    },

    validationError() {
      const amount = new Decimal(this.amount)
      if (!this.allowZero && amount.isZero() ) return "Amount needs to be greater than 0"
      if (amount.isNan() || amount.lt(0) ) return "Amount can not be negative"
    },

    amount: {

      get() {
        return this.amountBase.div(new Decimal(10).pow(this.assetInfo.decimalSeparator)).toString()
      },
      set(to, from) {
        this.calculateAmount(to)
      },

    },
  },

  methods:{
    calculateAmount(to){
      to = new Decimal(to || 0)

      if (!this.assetInfo) {
        this.lastTo = to
        this.amountBase = 0
        return
      }

      this.amountBase = to.mul(new Decimal(10).pow(this.assetInfo.decimalSeparator)).round()
      return this.$emit('changed', { amount: this.amountBase, });
    },
  },

  watch: {

    assetInfo:{
      immediate: true,
      handler: function (to){
        if (to && this.lastTo) {
          const lastTo = this.lastTo
          this.lastTo = null
          this.calculateAmount(lastTo)
        }
      },
    },

    initAmount: {
      immediate: true,
      handler: function (to) {
        if (to === undefined) this.amount = new Decimal(0)
        else this.calculateAmount(to)
      }
    },

    validationError: {
      immediate: true,
      handler: function (to, from) {
        return this.$emit('changed', { amountValidationError: to, })
      }
    },

  },

}
</script>

