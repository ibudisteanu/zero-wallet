<template>

  <layout>

    <layout-title icon="fas fa-money-check-alt" title="Private Conditional Payment">
      Private conditional payment to a recipient.
    </layout-title>

    <zether-tx :public-key="publicKey" :onSetTab="setTab" ref="zetherTx"
               :titles-offset="{'-1': {name: 'Conditional Payment', icon: 'fas fa-file',  tooltip: 'Conditional Payment'} }"
               :payloads-count="2" :build-payload-cb="buildPayloadCb" :before-process-cb="beforeProcessCb"
               :init-recipients="initRecipients" :init-amounts="initAmounts" :init-assets="initAssets"
               :init-extra-data="initExtraData" :init-extra-data-encrypted="initExtraDataEncrypted"
               :init-common-ring-size="initCommonRingSize">

      <template v-slot:tab_-1>

        <div class="row">
          <div class="col-12 col-sm-6" v-tooltip.bottom="`Deadline when the default resolution will be enforced.`">
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Deadline (No. of Blocks)</label>
            <input :class="`form-control ${validationDeadline ? 'is-invalid': ''}`" type="number" v-model.number="deadline" max="100000" min="10" :disabled="$route.query.deadline !== undefined && !$store.state.settings.expert" />
            <div v-if="validationDeadline" class="invalid-feedback d-block">{{ validationDeadline }}</div>
          </div>
          <div class="col-12 col-sm-6 mt-2 mt-sm-0">
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Default Resolution</label>
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input cursor-pointer" id="sender" type="radio" value="sender" v-model="defaultResolution" :disabled="$route.query.defaultResolution !== undefined && !$store.state.settings.expert" />
                <label class="form-check-label cursor-pointer" for="sender">Sender</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input cursor-pointer" id="recipient" type="radio" value="recipient" v-model="defaultResolution" :disabled="$route.query.defaultResolution !== undefined && !$store.state.settings.expert"/>
                <label class="form-check-label cursor-pointer" for="recipient">Recipient</label>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 mt-3" v-tooltip.bottom="`Minimum number of signatures to process the transaction.`">
          <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Threshold</label>
          <input :class="`form-control ${validationThreshold ? 'is-invalid' : ''}`" type="number" v-model.number="threshold" :disabled="$route.query.threshold !== undefined && !$store.state.settings.expert" />
          <div v-if="validationThreshold" class="invalid-feedback d-block">{{ validationThreshold }}</div>
        </div>

        <div class="mt-2">
          <div class="col-12" v-for="(key, i) in multisigPublicKeys" :key="`multisig-public-key-${i}`">
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Public Key {{ i }}</label>
            <div class="input-toggle-group">
              <input :class="`form-control ${validationPublicKeys[i] ? 'is-invalid' : ''}`" type="text" v-model="multisigPublicKeys[i]" :disabled="$route.query.multisigPublicKeys !== undefined && !$store.state.settings.expert">
              <i v-if="i >= 1 && ($route.query.multisigPublicKeys === undefined || $store.state.settings.expert)" class="fas fa-times input-toggle" :style="`${validationPublicKeys[i] ? 'right: 35px' : ''}`"
                 @click="()=>handleDeleteMultisigPublicKey(i)"/>
              <div v-if="validationPublicKeys[i]" class="invalid-feedback d-block">{{ validationPublicKeys[i] }}</div>
            </div>
          </div>
        </div>

        <button v-if="$route.query.multisigPublicKeys === undefined || $store.state.settings.expert" class="btn btn-falcon-default rounded-pill me-1 mt-3  cursor-pointer" type="button"
                :disabled="multisigPublicKeys.length >= 5" @click="handleAddNewMultisigPublicKey">
          <i class="fa fa-plus"/>
          Add new Multisig Public Key
        </button>

      </template>

    </zether-tx>

  </layout>
</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title";
import ZetherTx from "src/components/send/txs/zether-tx";
import TxRecipientAddress from "src/components/send/tx-recipient-address";

export default {

  components: {ZetherTx, LayoutTitle, Layout, TxRecipientAddress},

  props: {},

  data() {
    return {
      defaultResolution: "sender",
      deadline: 100,
      threshold: 1,
      multisigPublicKeys: [""],

      initRecipients: [],
      initAmounts: [],
      initAssets: [],
      initExtraData: [],
      initExtraDataEncrypted: [],
      initCommonRingSize: undefined,
    }
  },

  computed: {
    publicKey() {
      return this.$store.state.wallet.mainPublicKey
    },
    validationDeadline() {
      if (this.deadline < 10) return `The deadline should be greater or equal to 10`
      if (this.deadline > 100000) return `The deadline should be smaller or equal to 100000`
      return ""
    },
    validationThreshold() {
      if (this.threshold > this.multisigPublicKeys.length) return "Threshold should not exceed the number of multisig public keys"
      if (this.threshold < 1) return "Threshold should not be smaller than 1"
    },
    validationPublicKeys() {
      const out = []
      const unique = {}
      const v = this.multisigPublicKeys
      for (let i = 0; i < v.length; i++) {
        if (unique[v[i]]) out[i] = "It can not contain duplicate public keys"
        else out[i] = this.$validator.validatePublicKey(v[i])
        unique[v[i]] = true
      }
      return out
    },
  },

  methods: {

    async setTab({ oldTab, value}) {
      if (oldTab === -1 && value === 0) {
        if (this.validationThreshold) throw this.validationThreshold
        if (this.validationDeadline) throw this.validationDeadline
        const v = this.validationPublicKeys
        for (let i = 0; i < this.multisigPublicKeys.length; i++)
          if (v[i]) throw v[i]
        if (!v.length) throw "No Multisig Public Key was specified"
      }
      return true
    },

    handleDeleteMultisigPublicKey(i) {
      this.multisigPublicKeys.splice(i, 1)
    },

    handleAddNewMultisigPublicKey() {
      this.multisigPublicKeys.push('')
    },

    buildPayloadCb(index, payload) {
      if (index === 0) {
        payload.payloadScript = PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_CONDITIONAL_PAYMENT
      } else if (index === 1) {
        payload.allowRandomRecipient = true
      }

    },

    async beforeProcessCb(password, txData) {
      txData.payloads[0].extra = {
        deadline: new Decimal(this.deadline),
        defaultResolution: this.defaultResolution === "recipient",
        threshold: new Decimal(this.threshold),
        multisigPublicKeys: this.multisigPublicKeys,
      }
    },

    async updateRouteParams(to = this.$route) {

      try {

        if (to.query.deadline !== undefined) this.deadline = new Decimal(to.query.deadline)
        else this.deadline = new Decimal(100)

        if (to.query.defaultResolution !== undefined) {
          if ( to.query.defaultResolution === 'sender' || to.query.defaultResolution === 'recipient' ) this.defaultResolution = to.query.defaultResolution
          else throw "Invalid default resolution"
        } else this.defaultResolution = "sender"

        if (to.query.threshold !== undefined) this.threshold = new Decimal(to.query.threshold)
        else this.threshold = new Decimal(1)

        if (to.query.multisigPublicKeys !== undefined)
          this.multisigPublicKeys = to.query.multisigPublicKeys.map(it => Buffer.from(it, "hex").toString("base64"))
        else this.multisigPublicKeys = [""]

        if (to.query.recipients !== undefined) this.initRecipients = to.query.recipients
        else this.initRecipients = []

        if (to.query.amounts !== undefined) this.initAmounts = to.query.amounts.map(it => new Decimal(it))
        else this.initAmounts = []

        if (to.query.assets !== undefined) this.initAssets = to.query.assets.map(it => Buffer.from(it, "hex").toString("base64"))
        else this.initAssets = []

        if (to.query.extraData !== undefined) this.initExtraData = to.query.extraData.map(it => Buffer.from(it, "hex").toString("ascii"))
        else this.initExtraData = []

        if (to.query.extraDataEncrypted !== undefined) this.initExtraDataEncrypted = to.query.extraDataEncrypted.map(it => it==='true')
        else this.initExtraDataEncrypted = []

        if (to.query.commonRingSize !== undefined) this.initCommonRingSize = Number.parseInt(to.query.commonRingSize)
        else this.initCommonRingSize = undefined

      } catch (e) {
        console.error(e)
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

