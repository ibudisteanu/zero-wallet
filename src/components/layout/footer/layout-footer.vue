<template>
  <footer class="footer">
    <div class="g-0 justify-content-between fs--1 mt-4 mb-3 text-600">

      <div class="row pb-0 mb-0">
        <div class="col-12 col-auto text-center">
          <span class="pe-1">Consensus</span>
          <span class="pe-1 text-success">{{ blockchainStatus }}</span>
          <span class="pe-1">Block Height</span>
          <span v-if="blockHeight" class="text-success">#{{ blockHeight }}</span>
        </div>
      </div>

      <div class="row pb-0 mb-0">
        <div class="col-12 col-auto text-center">
          <span>WEB: {{ version }} WASM: {{ buildVersion }} </span>
        </div>
        <div class="col-12 col-auto text-center">
          <span>2019 - 2022 <a :href="website" target="_blank">{{ entity }}</a> </span>
        </div>
      </div>

    </div>


    <div v-if="$store.getters.isTestnet" class="fixed-button cursor-pointer " @click="handleShowTestnetFaucet"
         v-tooltip.top="`Testnet Faucet`">
      <div class="rounded-fixed-btn btn-secondary"><i class="fas fa-coins"></i></div>
    </div>

  </footer>

</template>

<script>
import consts from 'consts/consts';

export default {

  computed: {

    entity() {
      return consts.entity;
    },
    website() {
      return consts.website
    },

    blockHeight() {
      return this.$store.state.blockchain.end;
    },

    blockchainStatus() {

      const status = this.$store.state.blockchain.status;

      if (status === 'sync') return 'Established';
      if (status === 'syncing') return 'Syncing';
      if (status === 'offline') return 'Offline';
      if (status === 'online') return 'Connected';

      return 'na';
    },

    version() {
      return COMMITHASH.slice(0, 10)
    },

    buildVersion() {
      return PandoraPay.config.BUILD_VERSION
    }

  },

  methods: {
    handleShowTestnetFaucet() {
      this.$store.state.page.testnetFaucetModal.showModal()
    },
  }

}
</script>

<style scoped>

.fixed-button {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 0 20px 20px 20px;;
}

.rounded-fixed-btn {
  height: 50px;
  width: 50px;
  line-height: 50px;
  font-size: 1.5em;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
}

</style>
