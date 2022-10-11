<template>

  <modal ref="modal" title="Wallet Password is Required">

    <template v-slot:body>

      <span class="fw-black">For this operation, you need to specify the wallet password.</span>

      <div class="pt-4">
        <label>Password</label>
        <password-input :value="password" @changed="a => this.password = a "/>
      </div>

    </template>

    <template v-slot:footer>
      <alert-box v-if="error" class="w-100" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''">{{ error }}
      </alert-box>

      <button class="btn btn-falcon-danger" type="button" @click="handleSubmit">
        <i class="fas fa-key"></i> Submit
      </button>
      <button class="btn btn-falcon-secondary" type="button" @click="closeModal">
        <i class="fas fa-ban"></i> Close
      </button>
    </template>

  </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import LoadingSpinner from "../../utils/loading-spinner";
import PasswordInput from "src/components/utils/password-input";
import AlertBox from "src/components/utils/alert-box"
import LoadingButton from "src/components/utils/loading-button";

export default {

  components: {LoadingButton, LoadingSpinner, Modal, PasswordInput, AlertBox},

  data() {
    return {
      password: "",
      accepted: false,
      error: "",
    }
  },

  computed: {},

  methods: {

    async handleSubmit() {
      try {
        this.error = ""

        const out = await PandoraPay.wallet.manager.encryption.checkPasswordWallet(this.password)

        this.accepted = true
        this.closeModal();
      } catch (err) {
        this.error = err.toString()
      }
    },

    async showModal() {

      if (!this.$store.state.wallet.isEncrypted) return ''

      Object.assign(this.$data, this.$options.data.apply(this))
      await this.$refs.modal.showModal();
      return this.accepted ? this.password : null
    },

    closeModal() {
      if (this.$refs.modal) return this.$refs.modal.closeModal();
    },

  }

}
</script>

<style scoped>
</style>
