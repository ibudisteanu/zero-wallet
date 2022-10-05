<template>

  <layout>

    <layout-title icon="fas fa-money-check-alt" title="Private Send Funds">Send Funds Privately to another address
    </layout-title>

    <zether-tx :public-key="publicKey" :init-recipients="initRecipients" :init-amounts="initAmounts"
               :init-assets="initAssets"
               :init-extra-data="initExtraData" :init-extra-data-encryption="initExtraDataEncryption">

    </zether-tx>

  </layout>
</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title";
import ZetherTx from "src/components/send/txs/zether-tx";

export default {

  components: {ZetherTx, LayoutTitle, Layout,},

  props: {},

  data() {
    return {
      initRecipients: [],
      initAmounts: [],
      initAssets: [],
      initExtraData: [],
      initExtraDataEncryption: [],
    }
  },

  computed: {
    publicKey() {
      return this.$store.state.wallet.mainPublicKey
    },
  },

  methods: {
    async updateRouteParams(to = this.$route) {

      try {

        if (to.query.recipients !== undefined) this.initRecipients = to.query.recipients.split(',')
        else this.initRecipients = []

        if (to.query.amounts !== undefined) this.initAmounts = to.query.amounts.split(',').map(it => new Decimal(it))
        else this.initAmounts = []

        if (to.query.assets !== undefined) this.initAssets = to.query.assets.split(',').map(it => Buffer.from(it, "hex").toString("base64"))
        else this.initAssets = []

        if (to.query.extraData !== undefined) this.initExtraData = to.query.extraData.split(',').map(it => Buffer.from(it, "hex").toString("ascii"))
        else this.initExtraData = []

        if (to.query.extraDataEncryption !== undefined) this.initExtraDataEncryption = to.query.extraDataEncryption.split(',').map(it => it === '1' ? 'encrypted' : 'public')
        else this.initExtraDataEncryption = []

      } catch (e) {
        this.$store.dispatch('addToast', {
          type: 'error',
          title: `There was an error processing URL query`,
          text: `Raised an error ${e.toString()}`,
        })
      }
    },
  },

  watch: {
    $route: {
      immediate: true,
      handler: function (to, from) {
        this.updateRouteParams(to)
      }
    }
  },

}

</script>

<style scoped>
</style>
