<template>
  <modal ref="modal" title="Import wallet from Seed Words">

    <template v-slot:body>

      <alert-box type="warning">
        This operation will delete the existing wallet from your browser and will replace it with the one provided from the json file.
      </alert-box>

      <div>
        <label class="form-label" for="selectFile">Select .pandorawallet file</label>
        <input class="form-control" id="selectFile" type="file" v-on:change="handleFileUpload" size="1" accept=".pandorawallet" ref="refFile" />
      </div>

    </template>

    <template v-slot:footer>
      <button :disabled="!walletData" class="btn btn-falcon-danger" type="button" @click="handleImportWallet">
        <i class="fas fa-save"></i> Import Wallet
      </button>
      <button class="btn btn-outline-primary" type="button" @click="closeModal">
        <i class="fas fa-ban"></i> Close
      </button>
    </template>

  </modal>
</template>

<script>
import Modal from "src/components/utils/modal"
import AlertBox from "src/components/utils/alert-box";
import UtilsHelper from "src/utils/utils-helper";

export default {

  components: { Modal, AlertBox},

  data() {
    return {
      walletData: "",
    }
  },

  methods: {

    async showModal() {
      Object.assign(this.$data, this.$options.data.apply(this))
      return this.$refs.modal.showModal();
    },

    closeModal() {
      return this.$refs.modal.closeModal();
    },

    handleFileUpload(){

      this.walletData = ""

      if ((window.File && window.FileReader && window.FileList && window.Blob) === false)
        throw `Your browser/device doesn't support file import.`

      const file = this.$refs.refFile.files[0];

      if (!file) throw `No file selected.`

      let extension = file.name.split('.').pop();

      if (extension !== "pandorawallet") throw `File not supported. Maybe wrong file? `

      const reader = new FileReader();

      reader.onload = async (e) => {
        this.walletData = reader.result;
      }

      reader.readAsText(file);

    },

    async handleImportWallet(){

      try{

        const password = await this.$store.state.page.refWalletPasswordModal.showModal()
        if (password === null ) return

        this.$store.state.page.refLoadingModal.showModal();
        await UtilsHelper.sleep(50 )

        const out = await PandoraPay.wallet.manager.importWalletJSON( password, this.walletData );
        if (out)
          this.$store.dispatch('addToast', {
            type: 'success',
            title: `Wallet Imported Successfully`,
            text: `The selected wallet has been was imported successfully`,
          });

        this.closeModal()
      }catch(err){
        this.$store.dispatch('addToast', {
          type: 'error',
          title: `Error importing the wallet`,
          text: `Raised an error ${err.toString()}`,
        })
      }finally{
        this.$store.state.page.refLoadingModal.closeModal();
      }

    },

  }

}
</script>
