<template>

  <modal ref="modal" title="Import Address Secret Key" content-class="">

    <template v-slot:body>

      <wizard :titles="{
              0: {icon: 'fas fa-pencil-alt', name: 'Information', tooltip: 'Information of the account' },
              1: {icon: 'fas fa-file-code', name: 'Secret Key', tooltip: 'Secret Key' },
              2: {icon: 'fas fa-check', name: 'Done', tooltip: 'Finish importing account' }}"
              @onSetTab="setTab" controls-class-name="modal-footer bg-light" :allow-scroll="false"
              :buttons="{ 1: { icon: 'fas fa-file-upload', text: 'Import Account' }}">

        <template v-slot:tab_0>

          <div class="form-group pt-2">
            <label>Account Name</label>
            <input type="text" class="form-control" v-model="name"/>
          </div>

          <div class="form-check pt-4">
            <input class="form-check-input" id="staked" type="checkbox" v-model="staked"/>
            <label class="form-check-label" for="staked">Staked</label>
          </div>

          <div class="form-check pt-2">
            <input class="form-check-input" id="spendRequired" type="checkbox" v-model="spendRequired"/>
            <label class="form-check-label" for="spendRequired">Spend Key Required</label>
          </div>

        </template>

        <template v-slot:tab_1>
          <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1" for="secret-key">Secret Key</label>
          <textarea class="form-control form-control-sm fs--2" rows="4" v-model="secretKey" id="secret-key"></textarea>
        </template>

      </wizard>

    </template>

  </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import UtilsHelper from "src/utils/utils-helper";
import Wizard from "src/components/utils/wizard"

export default {

  components: {Modal, Wizard},

  data() {
    return {
      secretKey: '',
      staked: false,
      spendRequired: false,
      name: '',
    }
  },

  computed: {},

  methods: {

    async setTab({resolve, reject, oldTab, value}) {
      try {

        if (oldTab === 1 && value === 2)
          await this.handleImportAccountSecretKey()

        resolve(true)
      } catch (err) {
        reject(err)
      }
    },

    showModal() {
      Object.assign(this.$data, this.$options.data.apply(this))
      return this.$refs.modal.showModal();
    },

    closeModal() {
      return this.$refs.modal.closeModal();
    },

    async handleImportAccountSecretKey() {

      try {

        const secretKey = this.secretKey.trim()
        if (Buffer.from(secretKey, "base64").length < 80) throw "Secret key must be at least 80 bytes"

        const password = await this.$store.state.page.walletPasswordModal.showModal()
        if (password === null) return

        await this.$store.state.page.loadingModal.showModal();

        const out = await PandoraPay.wallet.manager.importWalletSecretKey(password, secretKey, this.name, this.staked, this.spendRequired);
        if (!out) throw "Your address already exists!"

        this.$store.dispatch('addToast', {
          type: 'success',
          title: `Imported successfully`,
          text: `Your Address has been successfully imported.`,
        });

        this.closeModal();

      } catch (err) {
        console.error(err)
        throw err
      } finally {
        this.$store.state.page.loadingModal.closeModal();
      }

    },

  },

}
</script>

<style scoped>

</style>
