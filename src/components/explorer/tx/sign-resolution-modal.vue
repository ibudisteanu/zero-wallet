<template>
  <modal ref="modal" :title="`Sign Resolution for tx ${ tx ? $base64ToHex(tx.hash) : ''}`">

    <template v-slot:body v-if="tx">

      <div class="row">

        <div class="d-inline-block">
          <label class="form-label me-2">Resolution</label>
          <div class="form-check form-check-inline">
            <input class="form-check-input pointer" id="sender" type="radio" value="sender" v-model="resolution" />
            <label class="form-check-label pointer" for="sender">Sender</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input pointer" id="receiver" type="radio" value="receiver" v-model="resolution" />
            <label class="form-check-label pointer" for="receiver">Receiver</label>
          </div>
        </div>
      </div>

      <div class="row mt-2">
        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Private Key</label>
        <textarea class="form-control" rows="2" v-model="privateKey"></textarea>
      </div>

      <div class="row mt-2">
        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Result</label>
        <textarea class="form-control form-control-sm fs--2" rows="4" v-model="result" disabled="true"></textarea>
      </div>

    </template>

    <template v-slot:footer>
      <alert-box v-if="error" class="w-100" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''" >{{error}}</alert-box>
      <button class="btn btn-falcon-primary" type="button" @click="handleSign">
        <i class="fas fa-signature"></i> Sign Resolution
      </button>
      <button class="btn btn-outline-primary" type="button" @click="closeModal">
        <i class="fas fa-ban"></i> Close
      </button>
    </template>

  </modal>
</template>

<script>
import Modal from "src/components/utils/modal"
import AlertBox from "../../utils/alert-box";
import UtilsHelper from "src/utils/utils-helper";
import AccountIdenticon from "../../wallet/account/account-identicon";

export default {

  components: { Modal, AlertBox },

  data() {
    return {
      error: '',
      tx: null,
      resolution: "sender",
      payloadIndex: 0,
      privateKey: "",
      result: "",
    }
  },

  methods: {

    async showModal(tx, payloadIndex) {

      Object.assign(this.$data, this.$options.data.apply(this))

      this.tx = tx
      this.payloadIndex = payloadIndex

      return this.$refs.modal.showModal();

    },

    closeModal() {
      return this.$refs.modal.closeModal();
    },

    async handleSign(){

      try{
        this.result = ""

        const out = JSONParse( MyTextDecode( await PandoraPay.transactions.signResolutionConditionalPayment(MyTextEncode( JSON.stringify( {
          txId: this.tx.hash,
          payloadIndex: this.payloadIndex,
          resolution: this.resolution === "receiver",
          privateKey: this.privateKey
        }) )) ))

        let foundPublicKey = false
        for (const publicKey of this.tx.payloads[this.payloadIndex].extra.multisigPublicKeys)
          if (publicKey === out.publicKey){
            foundPublicKey = true
            break
          }

        if (!foundPublicKey)
          throw "Public Key is not found in multisig list"

        this.result = JSONStringify(out, undefined, 2)

      }catch(err){
        this.error = err
      }finally{
      }

    },

  }

}
</script>