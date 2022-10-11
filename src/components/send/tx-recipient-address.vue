<template>
  <div class="col">
    <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">{{ text }} Address</label>

    <div :class="`${finalAddress ? 'recipient-row': ''} `">

      <account-identicon v-if="finalAddress" :public-key="finalAddress.publicKey" size="30" outer-size="8"/>

      <div class="input-toggle-group">
        <input :class="`form-control ${validationError ? 'is-invalid' : ''}`" type="text" v-model="recipient">
        <i class="fas fa-qrcode input-toggle" @click="showQrCodeScanner"
           :style="`${ validationError ?'right: 35px' : ''}`"></i>
      </div>

    </div>
    <div v-if="validationError" class="invalid-feedback d-block">{{ validationError }}</div>

  </div>
</template>

<script>
import AccountIdenticon from "src/components/wallet/account/account-identicon"

export default {

  components: {AccountIdenticon},

  props: {
    text: {default: ""},
    initRecipient: {default: ""},
  },

  data() {
    return {
      recipient: '',
      finalAddress: null,
      identiconSrc: null,
    }
  },

  computed: {
    validationError() {
      if (!this.recipient) return `${this.text} was not specified`;
      if (!this.finalAddress) return `${this.text} is invalid`;
    },
  },

  watch: {

    initRecipient: {
      immediate: true,
      handler: async function (to) {
        this.recipient = to
      }
    },

    recipient: {
      immediate: true,
      handler: async function (to,) {
        try {
          const addressData = await PandoraPay.addresses.decodeAddress(to)
          const address = JSONParse(MyTextDecode(addressData))
          this.finalAddress = address
        } catch (err) {
          this.finalAddress = null
        }

        this.$emit('changed', {
          address: this.finalAddress,
          addressEncoded: this.recipient,
        });

      },
    },

    validationError: {
      immediate: true,
      handler: async function (to,) {
        this.$emit('changed', {
          addressValidationError: to,
        });
      }
    }

  },

  methods: {

    async showQrCodeScanner() {
      const out = await this.$store.state.page.QRCodeScannerModal.showModal();
      if (out) this.recipient = out
    },

  }
}
</script>

<style scoped>
.recipient-row {
  display: grid;
  grid-template-columns: 45px 1fr;
  grid-column-gap: 10px;
}
</style>
