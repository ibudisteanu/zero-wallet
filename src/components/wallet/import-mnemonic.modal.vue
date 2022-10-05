<template>
  <modal ref="modal" title="Import wallet from Seed Words">

    <template v-slot:body>

      <alert-box type="warning">
        This operation will delete the existing wallet from your browser and will replace it with the one from the mnemonic
      </alert-box>

      <div>
        <label>Mnemonic</label>
        <textarea class="form-control" rows="4" v-model="mnemonic"></textarea>
      </div>

    </template>

    <template v-slot:footer>
      <button class="btn btn-falcon-danger" type="button" @click="handleImport">
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
      mnemonic: "",
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

    async handleImport(){

      try{

        const password = await this.$store.state.page.refWalletPasswordModal.showModal()
        if (password === null ) return

        this.$store.state.page.refLoadingModal.showModal();
        await UtilsHelper.sleep(50 )

        const out = await PandoraPay.wallet.importMnemonic( password, this.mnemonic.trim() );
        if (out)
          this.$store.dispatch('addToast', {
            type: 'success',
            title: `Mnemonic Imported Successfully`,
            text: `The mnemonic was imported successfully into your wallet`,
          });

        this.closeModal()
      }catch(err){
        this.$store.dispatch('addToast', {
          type: 'error',
          title: `Error importing mnemonic`,
          text: `Raised an error ${err.toString()}`,
        })
      }finally{
        this.$store.state.page.refLoadingModal.closeModal();
      }

    },

  }

}
</script>
