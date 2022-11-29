<template>

  <layout>

    <layout-title icon="fas fa-money-check-alt" title="Sign Resolution">
      Sign a Resolution for a Conditional Payment (Transaction)
    </layout-title>

    <wizard :titles="{
                0: {icon: 'fas fa-credit-card', name: 'Transaction Info', tooltip: 'Conditional Payment Transaction ID' },
                1: {icon: 'fas fa-key', name: 'Private Key', tooltip: 'Private Key of the Conditional Payment' },
                2: {icon: 'fas fa-signature', name: 'Generated Signature', tooltip: 'View your Signature' }}"
            :onSetTab="setTab" controls-class-name="card-footer bg-light" class="card"
            :buttons="{1: {icon: 'fas fa-file-upload', text: 'Sign Resolution'}, 2: {hide: true } }">

      <template v-slot:tab_0>
        <div class="pb-2">
          <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Transaction Id:</label>
          <input :class="`form-control ${$validator.validateHash(txId) ? 'is-invalid': ''}`" type="text" v-model="txId" :disabled="$route.query.txId !== undefined && !$store.state.settings.expert" >
          <div v-if="$validator.validateHash(txId)" class="invalid-feedback d-block">
            {{ $validator.validateHash(txId) }}
          </div>
        </div>

        <div class="pb-2">
          <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Payload Index:</label>
          <input :class="`form-control ${$validator.validateNumber(payloadIndex) ? 'is-invalid': ''}`" type="number" v-model="payloadIndex" :disabled="$route.query.payloadIndex !== undefined && !$store.state.settings.expert" >
          <div v-if="$validator.validateNumber(payloadIndex)" class="invalid-feedback d-block">
            {{ $validator.validateNumber(payloadIndex) }}
          </div>
        </div>
      </template>

      <template v-slot:tab_1>

        <div class="row">
          <div class="d-inline-block">
            <label class="form-label me-2">Resolution</label>
            <div class="form-check form-check-inline">
              <input class="form-check-input cursor-pointer" id="sender" type="radio" value="sender" v-model="resolution" :disabled="$route.query.resolution !== undefined && !$store.state.settings.expert" />
              <label class="form-check-label cursor-pointer" for="sender">Sender</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input cursor-pointer" id="recipient" type="radio" value="recipient" v-model="resolution" :disabled="$route.query.resolution !== undefined && !$store.state.settings.expert"/>
              <label class="form-check-label cursor-pointer" for="recipient">Receiver</label>
            </div>
          </div>
        </div>

        <div class="row mt-2 mb-2">
          <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Private Key</label>
          <textarea class="form-control" rows="3" v-model="privateKey" :disabled="$route.query.privateKey !== undefined && !$store.state.settings.expert" ></textarea>
        </div>

      </template>

      <template v-slot:tab_2>

        <div class="row mt-2">
          <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Signature</label>
          <textarea class="form-control" rows="3" v-model="resultSignature" disabled="true"></textarea>
        </div>

        <div class="row mt-4">
          <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Public Key</label>
          <textarea class="form-control" rows="3" v-model="resultPublicKey" disabled="true"></textarea>
        </div>

      </template>

    </wizard>

  </layout>
</template>

<script>
import Modal from "src/components/utils/modal"
import AlertBox from "src/components/utils/alert-box";
import Wizard from "src/components/utils/wizard"
import Layout from "src/components/layout/layout";
import LayoutTitle from "src/components/layout/layout-title";

export default {

  components: {Modal, AlertBox, Wizard, Layout, LayoutTitle},

  data() {
    return {
      txId: "",
      oldTx: null,
      payloadIndex: 0,
      resolution: "sender",
      privateKey: "",
      resultSignature: "",
      resultPublicKey: "",
    }
  },

  computed: {
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
  },

  methods: {

    async setTab({oldTab, value}) {

      if (oldTab === 0 && value === 1) {
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

      if (oldTab === 1 && value === 2)
        await this.handleSign()

      return true
    },

    async loadTransaction() {

      if (!this.hash) throw 'Tx hash was not specified';

      await this.$store.state.blockchain.syncPromise;

      if (this.oldTx && ( !this.tx || this.oldTx.hash !== this.tx.hash)) await this.removed(this.oldTx)

      const tx = await this.$store.dispatch('getTransactionByHash', this.hash);

      if (tx && !this._.isUnmounted) {
        this.oldTx = tx
        this.$store.commit('updateViewTransactionsHashes', {txsHashes: [tx.hash], insert: true})
        await this.$store.dispatch('subscribeTransaction', {txId: tx.hash})
      }

    },

    async removed(tx = this.oldTx) {
      if (!tx) return
      this.$store.commit('updateViewTransactionsHashes', {txsHashes: [tx.hash], insert: false})
      await this.$store.dispatch('unsubscribeTransaction', tx.hash)
    },

    async updateRouteParams(to = this.$route) {
      try {

        if (to.query.txId !== undefined) this.txId = to.query.txId
        else this.txId = ""

        if (to.query.payloadIndex !== undefined) this.payloadIndex = to.query.payloadIndex
        else this.payloadIndex = "0"

        if (to.query.resolution !== undefined) {
          if (to.query.resolution === "sender" || to.query.resolution === "recipient") this.resolution = to.query.resolution
          else throw "invalid query resolution"
        }
        else this.resolution = "sender"

        if (to.query.privateKey !== undefined) this.privateKey = Buffer.from(to.query.privateKey, "hex").toString("base64")
        else this.privateKey = ""

        if (this.hash) await this.loadTransaction()

      } catch (e) {
        this.$store.dispatch('addToast', {
          type: 'error',
          title: `There was an error processing URL query`,
          text: `Raised an error ${e.toString()}`,
        })
      }
    },

    async handleSign() {

      this.result = ""

      const out = JSONParse(MyTextDecode(await PandoraPay.transactions.signResolutionConditionalPayment(MyTextEncode(JSONStringify({
        txId: this.hash,
        payloadIndex: new Decimal(this.payloadIndex),
        resolution: this.resolution === "recipient",
        privateKey: this.privateKey
      })))))

      let foundPublicKey = false
      for (const publicKey of this.tx.payloads[this.payloadIndex].extra.multisigPublicKeys)
        if (publicKey === out.publicKey) {
          foundPublicKey = true
          break
        }

      if (!foundPublicKey)
        throw "Public Key is not found in multisig list"

      this.resultPublicKey = out.publicKey
      this.resultSignature = out.signature

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
    return this.removed()
  },

}
</script>