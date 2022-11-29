<template>

  <modal ref="modal" title="Create New Address">

    <template v-slot:body>

      <div class="form-group pb-2">
        <label class="form-label">Account Name</label>
        <input type="text" class="form-control" v-model="name"/>
      </div>

      <div class="form-check" v-if="$store.state.settings.expert">
        <input class="form-check-input" id="staked" type="checkbox" v-model="staked"/>
        <label class="form-check-label" for="staked">Staked</label>
      </div>

      <div class="form-check" v-if="$store.state.settings.expert">
        <input class="form-check-input" id="spendRequired" type="checkbox" v-model="spendRequired"/>
        <label class="form-check-label" for="spendRequired">Spend Key Required</label>
      </div>

    </template>

    <template v-slot:footer>
      <loading-button text="Create New Address" :submit="handleCreateNewAddress" icon="fas fa-plus"/>
      <button class="btn btn-outline-primary" type="button" @click="closeModal">
        <i class="fas fa-ban"></i>
        Close
      </button>
    </template>

  </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import UtilsHelper from "src/utils/utils-helper";
import LoadingButton from "../../utils/loading-button";

export default {

  components: {LoadingButton, Modal},

  data() {
    return {
      staked: false,
      spendRequired: false,
      name: '',
      error: '',
    }
  },

  computed: {},

  methods: {

    showModal() {
      Object.assign(this.$data, this.$options.data.apply(this))
      return this.$refs.modal.showModal();
    },

    closeModal() {
      return this.$refs.modal.closeModal();
    },

    async handleCreateNewAddress() {

      try {

        const password = await this.$store.state.page.walletPasswordModal.showModal()
        if (password === null) return

        await this.$store.state.page.loadingModal.showModal();

        const out = await PandoraPay.wallet.manager.addNewWalletAddress(password, this.name, this.staked, this.spendRequired);
        if (!out) throw "Result is false"

        this.$store.dispatch('addToast', {
          type: 'success',
          title: 'Address has been added successfully',
          text: 'A new address has been added and saved in your wallet'
        });

        this.closeModal()
      } catch (e) {
        throw e
      } finally {
        this.$store.state.page.loadingModal.closeModal();
      }

    },

  },

}
</script>

<style scoped>

</style>
