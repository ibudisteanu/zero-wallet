<template>

  <modal ref="modal" title="Import Account" content-class="">

    <template v-slot:body>

      <wizard :titles="{
              0: {icon: 'fas fa-file', name: 'File', tooltip: 'Select file to import account' },
              1: {icon: 'fas fa-wallet', name: 'Account', tooltip: 'Preview account' },
              2: {icon: 'fas fa-lock', name: 'Decrypt', tooltip: 'Decrypt file' },
              3: {icon: 'fas fa-check', name: 'Done', tooltip: 'Finish importing account' } }"
              :onSetTab="setTab" controls-class-name="modal-footer bg-light" :allow-scroll="false"
              :buttons="{ 1: { icon: 'fas fa-file-upload', text: 'Import Account' }}">

        <template v-slot:tab_0>
          <div>
            <label class="form-label" for="selectFile">Select .pandora file</label>
            <input class="form-control" id="selectFile" type="file" v-on:change="handleImportAccounts" size="1"
                   accept=".pandora" ref="refImportedAddresses"/>
          </div>
        </template>

        <template v-slot:tab_1>
          <span class="mb-3 d-block">Preview Imported Account</span>
          <div class="d-block" v-if="address">
            <div class="address align-items-center">
              <account-identicon :address="address.addressEncoded" size="35" outer-size="13"/>
              <span class="text-break">{{ address.addressEncoded }}</span>
            </div>
          </div>
        </template>

        <template v-slot:tab_2>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <password-input :value="addressPassword" @changed="a => this.addressPassword = a"/>
          </div>
        </template>

      </wizard>

    </template>

  </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import AccountIdenticon from "../../wallet/account/account-identicon";
import Wizard from "src/components/utils/wizard"

export default {

  components: {PasswordInput, Modal, AccountIdenticon, Wizard},

  data() {
    return {
      address: null,
      addressData: '',
      addressPassword: '',
    }
  },

  computed: {

    isAddressEncrypted() {
      return false;
    },

  },

  methods: {

    async setTab({ oldTab, value}) {

      if (oldTab === 0 && value === 1)
        await this.handleImportAccounts()

      if (oldTab === 1 && value === 2)
        await this.handleProcess()

      return true
    },

    showModal() {
      Object.assign(this.$data, this.$options.data.apply(this))
      return this.$refs.modal.showModal();
    },

    closeModal() {
      return this.$refs.modal.closeModal();
    },

    handleImportAccounts() {

      this.address = null
      this.addressData = ""

      if ((window.File && window.FileReader && window.FileList && window.Blob) === false)
        throw `Your browser/device doesn't support file import.`

      const file = this.$refs.refImportedAddresses.files[0];

      if (!file) throw `No file selected.`

      let extension = file.name.split('.').pop();

      if (extension !== "pandora") throw `File not supported. Maybe wrong file? `

      const reader = new FileReader();

      reader.onload = async (e) => {

        const data = JSONParse(reader.result);

        this.address = data;
        this.addressData = reader.result;

      }

      reader.readAsText(file);

    },

    async handleProcess() {

      try {

        const password = await this.$store.state.page.walletPasswordModal.showModal()
        if (password === null) return

        await this.$store.state.page.loadingModal.showModal();

        const out = await PandoraPay.wallet.manager.importWalletAddressJSON(password, this.addressData, this.addressPassword,);
        if (!out) throw `Your address already exists`

        this.$store.dispatch('addToast', {
          type: 'success',
          title: `Imported successfully`,
          text: `Your Address has been successfully imported.`,
        });

        this.closeModal();

      } catch (err) {
        throw err
      } finally {
        this.$store.state.page.loadingModal.closeModal();
      }

    }

  },

}
</script>

<style scoped>

.address {
  display: grid;
  grid-template-columns: 60px 1fr;
  grid-column-gap: 10px;
}

</style>
