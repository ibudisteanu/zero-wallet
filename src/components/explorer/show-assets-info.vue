<template>

  <div>

    <div class="d-none d-sm-flex row bg-200 text-900 py-2 fs--1 fw-semi-bold">
      <span class="d-none d-sm-block col-sm-5 col-lg-3 text-truncate">Name</span>
      <span class="d-none d-sm-block col-sm-3 col-lg-2 text-truncate">Ticker</span>
      <span class="d-none d-sm-block col-sm-4 col-lg-2 text-truncate">Hash</span>
      <span class="d-none d-lg-block col-lg-5 text-truncate">Description</span>
    </div>

    <div v-for="(assetInfo, key) in assetsInfo" :key="`show-asset-${key}`"
         :class="`row pb-2 pt-2 fs--1 align-items-center ${key % 2 === 0 ?'bg-light':''}`">

      <span class="col-5 d-block d-sm-none text-dark">Name</span>
      <span class="col-7 col-sm-4 col-lg-3 text-truncate">
        <identicon v-if="assetInfo.hash" :hash="assetInfo.hash" size="21" outer-size="7" class="pe-1"
                   :uri="`/explorer/asset/${$base64ToHex(assetInfo.hash)}`"/>
        <router-link :to="`/explorer/asset/${$base64ToHex(assetInfo.hash)}`">
            {{ assetInfo.identification }}
        </router-link>
      </span>

      <span class="col-5 d-block d-sm-none text-dark">Ticker</span>
      <span class="col-7 col-sm-2 col-lg-2 text-truncate">${{ assetInfo.identification }}</span>

      <span class="col-5 d-block d-sm-none text-dark">Hash</span>
      <span class="col-7 col-sm-2 col-lg-2 text-truncate">{{ $base64ToHex(assetInfo.hash) }}</span>

      <span class="col-5 d-block d-sm-none text-dark">Description</span>
      <span class="col-7 d-sm-none d-lg-block col-lg-5 text-truncate">{{ assetInfo.description }}</span>

    </div>

  </div>

</template>

<script>

import Identicon from "src/components/utils/identicon";

export default {

  components: {Identicon},

  props: {
    assetsInfo: {default: null},
  },

  methods: {},

}
</script>

<style scoped>


</style>
