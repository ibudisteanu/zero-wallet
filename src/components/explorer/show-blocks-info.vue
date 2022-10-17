<template>

  <div>
    <div class="d-none d-sm-flex row bg-200 text-900 py-2 fs--1 fw-semi-bold">
      <span class="d-none d-sm-block col-sm-3 col-md-2 text-truncate">Hash</span>
      <span class="d-none d-md-block col-md-2 text-truncate">Kernel Hash</span>
      <span class="d-none d-sm-block col-sm-2 col-md-2 text-truncate">Height</span>
      <span class="d-none d-sm-block col-sm-2 col-md-2 text-truncate">Fees</span>
      <span class="d-none d-sm-block col-sm-2 col-md-1 text-truncate">Time</span>
      <span class="d-none d-sm-block col-sm-2 col-md-2 text-truncate">Size</span>
      <span class="d-none d-sm-block col-sm-1 col-md-1 text-truncate">TX</span>
    </div>
    <div v-for="(blockInfo, key) in blocksInfo" :key="`show-block-${key}`"
         :class="`row pb-2 pt-2 fs--1 align-items-center ${key % 2 === 0 ?'bg-light':''}`">

      <span class="col-5 d-block d-sm-none text-dark">Hash</span>
      <span class="col-7 col-sm-2 col-md-2 text-truncate">
        <router-link :to="`/explorer/block/${$strings.base64ToHex(blockInfo.hash)}`">
          {{ $strings.base64ToHex(blockInfo.hash) }}
        </router-link>
      </span>

      <span class="col-5 d-xs-none d-sm-none d-md-none text-dark">Kernel Hash</span>
      <span class="col-7 d-xs-none d-sm-none d-md-block  col-md-2 text-truncate">{{ $strings.base64ToHex(blockInfo.kernelHash) }}</span>

      <span class="col-5 d-block d-sm-none text-dark">Height</span>
      <span class="col-7 col-sm-2 col-md-2 text-truncate">
        <router-link :to="`/explorer/block/${blockInfo.height}`">{{ blockInfo.height }}</router-link>
      </span>

      <span class="col-5 d-xs-none d-sm-none d-md-none text-dark">Fees</span>
      <span class="col-7 col-sm-2 col-md-2 text-truncate">
        <amount :value="blockInfo.fees" :sign="true" :show-asset="false "/>
      </span>

      <span class="col-5 d-block d-sm-none text-dark">Timestamp</span>
      <span class="col-7 col-sm-2 col-md-1  text-truncate"
            v-tooltip.bottom="`${ $strings.formatTime( $store.state.blockchain.genesisTimestamp.plus( blockInfo.timestamp).times(1000) ) }`">
        {{ $strings.timeSince($store.state.blockchain.genesisTimestamp.plus(blockInfo.timestamp).times(1000), false) }}
      </span>

      <span class="col-5 d-block d-sm-none text-dark">Size</span>
      <div class="col-7 col-sm-2 col-md-2 text-truncate">
        <span v-tooltip.bottom="`${ $strings.formatBytes(blockInfo.size) }`">
          {{ $strings.formatSize(blockInfo.size, 1) }}
        </span>
      </div>

      <span class="col-5 d-block d-sm-none text-dark">Transactions</span>
      <span class="col-7 col-sm-1 col-md-1  text-truncate">{{ blockInfo.txs }} </span>

    </div>

  </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon";
import Amount from "src/components/wallet/amount"

export default {

  components: {AccountIdenticon, Amount},

  props: {
    blocksInfo: {default: null},
  },

  methods: {},

}
</script>

<style scoped>


</style>
