<template>
  <modal ref="modal" :title="`Sign Message`">

    <template v-slot:body v-if="account">

      <div class="row">
        <div class="form-check form-check">
          <input class="form-check-input" id="sha3" type="checkbox" value="hex" v-model="sha3" />
          <label class="form-check-label" for="sha3">SHA3</label>
        </div>
      </div>

      <div class="row mt-2">
        <div class="d-inline-block p-0">
          <div class="form-check form-check-inline">
            <input class="form-check-input" id="hex" type="radio" value="hex" v-model="type" />
            <label class="form-check-label" for="hex">Hex</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" id="base64" type="radio" value="base64" v-model="type" />
            <label class="form-check-label" for="base64">Base64</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" id="ascii" type="radio" value="ascii" v-model="type" />
            <label class="form-check-label" for="ascii">Ascii</label>
          </div>
        </div>
      </div>

      <div class="row mt-2">
        <label class="form-label">Message to be signed</label>
        <textarea class="form-control" rows="4" v-model="message"></textarea>
      </div>

      <div class="row mt-2">
        <label class="form-label">Signature</label>
        <textarea class="form-control" rows="2" v-model="signature" disabled="true"></textarea>
      </div>

    </template>

    <template v-slot:footer>
      <alert-box v-if="error" class="w-100" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''" >{{error}}</alert-box>
      <button class="btn btn-falcon-primary" type="button" @click="handleSign">
        <i class="fas fa-signature"></i> Sign Message
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
      account: null,
      type: "ascii",
      sha3: false,
      message: "",
      signature: "",
    }
  },

  methods: {

    async showModal(account) {

      Object.assign(this.$data, this.$options.data.apply(this))

      this.account = account;

      return this.$refs.modal.showModal();

    },

    closeModal() {
      return this.$refs.modal.closeModal();
    },

    async handleSign(){

      let out
      try{
        this.signature = ""

        let message = Buffer.from(this.message, this.type )

        if (this.sha3){
          out = await PandoraPay.cryptography.sha3( message.toString("base64") )
          message = Buffer.from(out, "base64")
        }

        const password = await this.$store.state.page.walletPasswordModal.showModal()
        if (password === null ) return

        out = await PandoraPay.wallet.signMessageWalletAddress( password, message.toString("base64"), this.account.addressEncoded );
        if (out)
          this.signature = out

      }catch(err){
        this.error = err
      }finally{
      }

    },

  }

}
</script>