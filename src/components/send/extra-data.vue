<template>
  <div>

    <div class="d-flex flex-row align-items-center flex-wrap">
      <div class="form-check col-12 col-sm-5 col-md-3 col-lg-3">
        <input class="form-check-input" type="checkbox" v-model="encrypted" :disabled="!!paymentID" id="typePublic"/>
        <label class="form-check-label" for="typePublic">Encrypted Message</label>
        <i class="fas fa-question ms-1" v-tooltip.bottom="`The message will be public on the chain. Anybody can see this message attached to this transaction.`"/>
      </div>
      <div class="col-12 col-sm-7 col-md-9 col-lg-9">
        <input class="form-control " type="text" v-model="data" :disabled="!!paymentID" >
      </div>
    </div>

    <template v-if="recipients && recipients.length > 1 && encrypted">

      <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Address to encrypt:</label>

      <div :class="`${publicKeyToEncrypt ? 'recipient-row' : '' }`">

        <account-identicon v-if="publicKeyToEncrypt" :public-key="publicKeyToEncrypt" size="30" outer-size="8"/>

        <select :class="`form-select ${validationPublicKeyToEncrypt ? 'is-invalid' :''} `" v-model="publicKeyToEncrypt">
          <option v-for="(recipient, id) in recipients" :key="`selected-address-${id}`"
                  :value="(recipient.address && recipient.address.publicKey) ? recipient.address.publicKey : '' "
                  :class="`${ (recipient.address && recipient.address.publicKey) ? '' : 'text-danger'}`">
            <template v-if="recipient.address">
              {{ recipient.addressEncoded }}
            </template>
          </option>
        </select>

      </div>

      <div v-if="validationPublicKeyToEncrypt" class="invalid-feedback d-block">
        {{ validationPublicKeyToEncrypt }}
      </div>

    </template>
  </div>
</template>

<script>
import AccountIdenticon from "src/components/wallet/account/account-identicon"

export default {

  components: {AccountIdenticon},

  props: {
    recipients: {default: null},
    paymentID: {default: null},
    initData: {default: ""},
    initDataEncrypted: {default: false}
  },

  data() {
    return {
      error: '',
      encrypted: true,
      data: '',
      publicKeyToEncrypt: null,
    }
  },

  computed: {

    validationData() {
      if (this.data.length > 512) return "length is invalid"
    },

    validationPublicKeyToEncrypt() {
      if (!this.encrypted) return
      if (this.recipients && this.recipients.length > 1 && !this.publicKeyToEncrypt) return "No selected address"
    },

    validationError() {
      if (this.validationPublicKeyToEncrypt) return this.validationPublicKeyToEncrypt
      if (this.validationData) return this.validationData
    }

  },

  watch: {

    paymentID: {
      immediate: true,
      handler: function (to, from) {

        if (to && this.data !== to) {
          this.data = to
          this.encrypted = true
          return
        }

        if (this.data === from) this.data = ""
      },
    },

    initData: {
      immediate: true,
      handler: function (to, from) {
        this.data = to
      }
    },

    initDataEncrypted: {
      immediate: true,
      handler: function (to, from) {
        this.encrypted = to
      }
    },

    encrypted: {
      immediate: true,
      handler: function (to, from) {
        return this.$emit('changed', {
          encrypted: to,
          publicKeyToEncrypt: to ? this.publicKeyToEncrypt: null ,
        })
      }
    },

    data: {
      immediate: true,
      handler: function (to, from) {
        return this.$emit('changed', {data: to,})
      }
    },

    publicKeyToEncrypt: {
      immediate: true,
      handler: function (to, from) {
        return this.$emit('changed', {publicKeyToEncrypt: to,})
      }
    },

    validationError: {
      immediate: true,
      handler: function (to, from) {
        return this.$emit('changed', {validationError: to,})
      }
    }

  },

}
</script>


<style scoped>
.recipient-row {
  display: grid;
  grid-template-columns: 45px 1fr;
  grid-column-gap: 10px;
}
</style>
