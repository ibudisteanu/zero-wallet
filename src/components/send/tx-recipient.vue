<template>

  <div class="row">
    <tx-recipient-address :init-recipient="initRecipient" :text="text" :balances="balances" @changed="changedRecipient"
                          class="col-12" />

    <tx-amount v-if="asset" :init-amount="initAmount" :validate-amount="validateAmount" :allow-zero="allowZero"
               class="pt-2 col-12 col-md-6" :balances="balances" :asset="asset" @changed="changedAmount"/>

    <tx-asset :init-asset="initAsset" :assets="availableAssets" @changed="changedAsset" class="pt-2 col-12 col-md-6"/>
  </div>

</template>

<script>

import TxAmount from "./tx-amount"
import TxAsset from "./tx-asset"
import TxRecipientAddress from "./tx-recipient-address";

export default {

  components: {TxRecipientAddress, TxAsset, TxAmount},

  props: {
    availableAssets: {default: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64},
    balances: {default: null},
    text: {default: "Recipient"},
    allowZero: {default: false},
    validateAmount: {default: false},

    initRecipient: {default: undefined},
    initAmount: {default: undefined},
    initAsset: {default: undefined},
  },

  data() {
    return {
      asset: null,
    }
  },

  methods: {

    changedRecipient(data) {
      return this.$emit('changed', {...data,});
    },

    changedAmount(data) {
      return this.$emit('changed', {...data,});
    },

    changedAsset(data) {
      if (data.asset) this.asset = data.asset
      return this.$emit('changed', {...data,});
    },

  },


}
</script>

