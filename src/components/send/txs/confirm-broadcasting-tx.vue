<template>
  <div>

    <div class="row align-items-center text-center mb-3">
      <div class="col-sm-6 text-sm-start">
        <img :src="require('src/assets/svgs/sending-coins.svg').default" alt="review tx" width="150">
      </div>
      <div class="col text-sm-end mt-3 mt-sm-0">
        <h2 class="mb-3">Transaction Preview</h2>
        <h5>Transaction Details</h5>
        <p class="fs--1 mb-0">Review the transaction details before propagating it to the network. Once the transaction
          is broadcast, it can not be revert back.</p>
      </div>
      <div class="col-12">
        <hr>
      </div>
    </div>

    <show-transaction :tx="tx" :confirmation="true"/>

  </div>
</template>

<script>
import ShowTransaction from "src/components/explorer/tx/show-transaction";
import Amount from "src/components/wallet/amount"
import Decimal from "decimal.js";

export default {

  components: {ShowTransaction, Amount},

  props: {
    tx: {default: null},
  },

  computed: {},


}
</script>