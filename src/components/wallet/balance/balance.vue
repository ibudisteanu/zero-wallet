<template>

  <div class="pt-2">
    <template v-if="version === 'zether'">
      <i v-if="!canBeDecrypted" class="fas fa-lock pe-2 fs-2" v-tooltip.bottom="`Homomorphic Encrypted Amount: ${balance}`"/>
      <loading-button v-else-if="!decryptedBalance" :submit="decryptBalance" :text="getCurrencyType" icon="fas fa-key" tooltip="ecrypt All your balances" class-custom="cursor-pointer dropdown-item" component="span"/>
    </template>

    <div v-if="decryptedBalance">
      <h4 class="fw-medium d-inline-block" v-if="getAsset">
        <template v-if="version === 'zether'">
          <template v-if="decryptedBalance !== null">{{ amount }}</template>
        </template>
        <template v-else>{{ amount }}</template>
      </h4>
      <small class="ps-1 fs--1 text-700 d-inline-block">
        <router-link :to="`/explorer/asset/${$strings.base64ToHex(asset)}`" class="currency" v-tooltip.bottom="$strings.base64ToHex(asset)">
          {{  this.getAsset ? this.getAsset.identification : ''  }}
        </router-link>
      </small>
    </div>

  </div>

</template>

<script>

import LoadingButton from "../../utils/loading-button";

export default {

  components: {LoadingButton},

  props: {
    version: {default: "transparent"},
    asset: {default: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64},
    balance: {default: () => new Decimal(0)},
    publicKey: {default: ""},     //required for version zether
    canBeDecrypted: {default: false}  //required for version zether
  },

  data() {
    return {
      decryptedBalance: null,
    }
  },

  computed: {

    getCurrencyType(){
      return "Decrypt " + ( this.getAsset ? this.getAsset.identification : '' ) + " token"
    },

    getAsset() {
      return this.$store.getters.getAsset(this.asset);
    },
    amount() {
      let amount
      if (this.version === "transparent")
        amount = this.balance
      else {
        if (this.decryptedBalance === null) return
        amount = this.decryptedBalance
      }
      return this.$strings.formatMoney(new Decimal(amount || 0).div(new Decimal(10).pow(this.getAsset.decimalSeparator)).toString(), this.getAsset.decimalSeparator)
    },

  },

  watch: {
    balance: {
      immediate: true,
      handler: function (to, from) {
        if (to === from) return

        if (this.version === "zether") {
          const walletAddress = this.$store.state.wallet.addresses[this.publicKey]
          if (walletAddress && walletAddress.decryptedBalances && walletAddress.decryptedBalances[this.asset])
            if (walletAddress.decryptedBalances[this.asset].encryptedBalance === this.balance) {
              this.decryptedBalance = walletAddress.decryptedBalances[this.asset].amount
              return
            }
          this.decryptedBalance = null
        }
      }
    },
  },

  methods: {
    async decryptBalance() {
      const password = await this.$store.state.page.walletPasswordModal.showModal()
      if (password === null) return

      const {decryptedBalance} = await this.$store.state.page.decryptBalanceModal.showModal(this.publicKey, this.balance, this.asset, true, password)
      this.decryptedBalance = decryptedBalance
    }
  },

}
</script>

<style scoped>

</style>
