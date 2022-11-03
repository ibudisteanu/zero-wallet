<template>
  <div>
    <div class="form-check">
      <input class="form-check-input" id="feeAuto" type="checkbox" v-model="feeType"/>
      <label class="form-check-label" for="feeAuto">Automatically Calculate Tx Fee</label>
    </div>

    <input-amount v-if="!feeType" text="Fee Amount" @changed="changedFeeManual" :allow-zero="allowZero" :asset="asset"/>
  </div>
</template>

<script>
import InputAmount from "./input-amount"
import Decimal from "decimal.js"

export default {

  components: {InputAmount},

  props: {
    allowZero: {default: false},
    asset: {default: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64},
  },

  data() {
    return {
      feeType: true,

      feeManual: {
        amount: Decimal_0,
        validationError: "",
      },
    }
  },

  methods: {
    changedFeeManual(data) {
      this.feeManual = {...this.feeManual, ...data,}
    },
  },

  watch: {
    feeType: {
      immediate: true,
      handler: function (to, from) {
        return this.$emit('changed', {feeType: to,})
      }
    },
    feeAuto: {
      immediate: true,
      handler: function (to, from) {
        return this.$emit('changed', {feeAuto: to,})
      }
    },
    feeManual: {
      immediate: true,
      handler: function (to, from) {
        return this.$emit('changed', {feeManual: to,})
      }
    }
  }

}
</script>