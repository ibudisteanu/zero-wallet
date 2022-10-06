<template>

  <layout>

    <layout-title icon="fas fa-money-check-alt" title="Resolution Conditional Payment">
      Create a Public Transaction to draw the conclusion of a conditional payment.
    </layout-title>

    <simple-tx :titles-offset="{
                    '-2': { icon: 'fas fa-credit-card',  name: 'Conditional Payment', tooltip: 'Conditional Payment Transaction ID' },
                    '-1': {icon: 'fas fa-signature', name: 'Signatures', tooltip: 'Signatures required for multisig'} }"
               :public-key="publicKey" @onSetTab="setTab" account-type="none"
               :enable-fee="false" :enable-sender="false" :before-process-cb="beforeProcessCb">

      <template v-slot:tab_-2>

        <div class="pb-2">
          <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Transaction Id:</label>
          <input :class="`form-control ${$store.getters.validateHash(txId) ? 'is-invalid': ''}`" type="text" v-model="txId">
          <div v-if="$store.getters.validateHash(txId)" class="invalid-feedback d-block">
            {{ $store.getters.validateHash(txId) }}
          </div>
        </div>

        <div class="pb-2">
          <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Payload Index:</label>
          <input :class="`form-control ${$store.getters.validateNumber(payloadIndex) ? 'is-invalid': ''}`" type="number" v-model="payloadIndex">
          <div v-if="$store.getters.validateNumber(payloadIndex)" class="invalid-feedback d-block">
            {{ $store.getters.validateNumber(payloadIndex) }}
          </div>
        </div>

      </template>

      <template v-slot:tab_-1>

        <div class="row">
          <div class="d-inline-block">
            <label class="form-label me-2">Resolution</label>
            <div class="form-check form-check-inline">
              <input class="form-check-input pointer" id="sender" type="radio" value="sender" v-model="resolution">
              <label class="form-check-label pointer" for="sender">Sender</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input pointer" id="recipient" type="radio" value="recipient" v-model="resolution">
              <label class="form-check-label pointer" for="recipient">Recipient</label>
            </div>
          </div>
        </div>

        <div class="row mt-2" v-if="payload">
          <label class="form-label mt-2">Multisig Threshold: {{ payload.extra.multisigThreshold }} of
            {{ payload.extra.multisigPublicKeys.length }} </label>
          <div v-for="(pub, i) in multisigPublicKeys" :key="i" class="my-4">
            <label class="form-label">Public Key: {{ pub }}</label>
            <div class="row">
              <div class="col-12">
                <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Signature</label>
                <input :class="`form-control ${validationSignatures[i] ? 'is-invalid': ''}`" type="text" v-model="signatures[i]">
                <div v-if="validationSignatures[i]" class="invalid-feedback d-block">
                  {{ validationSignatures[i] }}
                </div>
              </div>
            </div>
          </div>
        </div>

      </template>

    </simple-tx>

  </layout>
</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title";
import SimpleTx from "src/components/send/txs/simple-tx";


export default {

  components: {SimpleTx, LayoutTitle, Layout,},

  props: {},

  data() {
    return {
      txId: "",
      payloadIndex: 0,
      resolution: "sender",
      multisigPublicKeys: [],
      signatures: [],
      error: "",
    }
  },

  computed: {
    publicKey() {
      return this.$store.state.wallet.mainPublicKey
    },
    hash() {
      try {
        const x = Buffer.from(this.txId, "hex")
        if (x.length === PandoraPay.cryptography.HASH_SIZE)
          return x.toString("base64")
      } catch (e) {

      }
      return ""
    },
    tx() {
      return this.$store.state.transactions.txsByHash[this.hash];
    },
    txInfo() {
      return this.tx ? this.$store.state.transactionsInfo.txsByHash[this.hash] : null
    },
    payload() {
      return this.tx && this.tx.payloads[this.payloadIndex] ? this.tx.payloads[this.payloadIndex] : null
    },
    validationSignatures() {
      const out = []
      for (let i = 0; i < this.signatures.length; i++)
        if (this.signatures[i])
          out[i] = this.$store.getters.validateSignature(this.signatures[i])
      return out
    },
  },

  methods: {
    async setTab({resolve, reject, oldTab, value}) {
      try {

        if (oldTab === -2 && value === -1) {

          await this.loadTransaction()
          if (!this.tx) throw "Transaction was not found"

          if (!this.tx.version.eq(PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER))
            throw "Wrong Transaction. It is not not a Zether tx"

          if (!this.payload) throw "Payload was not found!"

          if (!this.payload.payloadScript.equals(PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_CONDITIONAL_PAYMENT))
            throw "Payload Script is not SCRIPT_CONDITIONAL_PAYMENT"

          if (!this.txInfo)
            throw "Transaction is not included in Blockchain"

          if (this.$store.state.blockchain.end.minus(this.payload.extra.deadline).gte(this.txInfo.blkHeight))
            throw "Transaction Conclusion has expired"

          this.multisigPublicKeys = this.payload.extra.multisigPublicKeys.map(it => it)
        }
        if (oldTab === -1 && value === 0) {
          let counter = 0

          const v = this.validationSignatures

          for (let i = 0; i < this.signatures.length; i++)
            if (this.signatures[i]) {
              if (v[i]) throw v[i]
              if (this.signatures[i]) counter++
            }

          if (counter < this.payload.extra.multisigThreshold)
            throw `You will need at least ${this.payload.extra.multisigThreshold} signatures`

        }

        resolve(true)

      } catch (err) {
        reject(err)
      }


    },

    beforeProcessCb(password, data) {

      data.txScript = PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_RESOLUTION_CONDITIONAL_PAYMENT
      data.extra = {
        txId: this.hash,
        payloadIndex: new Decimal(this.payloadIndex),
        resolution: this.resolution === "recipient",
        multisigPublicKeys: [],
        signatures: [],
      }

      for (let i = 0; i < this.signatures.length; i++)
        if (this.signatures[i]) {
          data.extra.multisigPublicKeys.push(this.multisigPublicKeys[i])
          data.extra.signatures.push(this.signatures[i])
        }

    },

    async loadTransaction() {

      if (!this.hash) throw 'Tx hash was not specified';

      await this.$store.state.blockchain.syncPromise;

      if (this.tx && this.tx.hash === this.hash) return

      if (this.tx) await this.removed()

      const tx = await this.$store.dispatch('getTransactionByHash', this.hash);

      if (tx) {
        this.$store.commit('updateViewTransactionsHashes', {txsHashes: [tx.hash], insert: true})
        await this.$store.dispatch('subscribeTransaction', {txId: tx.hash})
      }

    },

    async removed(tx = this.tx) {
      this.$store.commit('updateViewTransactionsHashes', {txsHashes: [tx.hash], insert: false})
      await this.$store.dispatch('unsubscribeTransaction', tx.hash)
    },

    async updateRouteParams(to = this.$route) {
      try {

        if (to.query.txId !== undefined) this.txId = to.query.txId
        else this.txId = ""

        if (to.query.payloadIndex !== undefined) this.payloadIndex = to.query.payloadIndex
        else this.payloadIndex = "0"

        if (to.query.resolution !== undefined) this.resolution = to.query.resolution === "recipient"
        else this.resolution = "sender"

        if (to.query.signatures !== undefined) this.signatures = to.query.signatures.split(",").map(it => Buffer.from(it, "hex").toString("base64"))
        else this.signatures = []

        if (this.hash) await this.loadTransaction()

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

  beforeUnmount() {
    if (this.tx) return this.removed()
  },

}

</script>

