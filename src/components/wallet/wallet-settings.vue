<template>

  <div class="card mb-3  overflow-hidden">
    <div class="card-header bg-light">
      <div class="row align-items-center">
        <div class="col">
          <h5 class="mb-0">
            Wallet Options
          </h5>
        </div>
      </div>
    </div>
    <div class="card-body p-0" >
      <div class="card-footer g-0 d-block p-3">

        <div class="two-buttons">
          <loading-button :submit="handleImportMnemonic" text="Import new wallet From Secret Phrase" icon="fas fa-file-import" tooltip="Clear wallet & import a new wallet from Secret Words (Mnemonic)" class-custom="cursor-pointer dropdown-item" component="span" :can-load="false"/>
          <loading-button :submit="handleViewMnemonic" text="View current wallet Secret Phrase" icon="fas fa-key" tooltip="Show your Secret Words (Mnemonic)" class-custom="cursor-pointer dropdown-item" component="span" :can-load="false"/>
        </div>
        <div class="dropdown-divider"></div>

        <div class="two-buttons">
          <loading-button :submit="handleExportWallet" text="Export Wallet" icon="fas fa-download" tooltip="Export your wallet to your computer" class-custom="cursor-pointer dropdown-item" component="span" :can-load="false"/>
          <loading-button :submit="handleImportWallet" text="Import Wallet" icon="fas fa-upload" tooltip="Import a pandora wallet from your computer" class-custom="cursor-pointer dropdown-item" component="span" :can-load="false"/>
        </div>
        <div class="dropdown-divider"></div>
        <div class="two-buttons">
          <loading-button v-if="!encrypted" :submit="()=>$router.push('/set-password')" text="Set Password" icon="fas fa-lock" tooltip="Encrypt your wallet by setting a Password" class-custom="cursor-pointer dropdown-item" component="span" :can-load="false"/>
          <loading-button v-else :submit="()=>$router.push('/remove-password')" text="Remove Password" icon="fas fa-unlock" tooltip="Decrypt your wallet by removing the Password" class-custom="cursor-pointer dropdown-item" component="span" :can-load="false"/>
          <loading-button :submit="handleDeleteWallet" text="Delete Wallet" icon="fas fa-trash" tooltip="Clear & create new wallet" class-custom="cursor-pointer dropdown-item text-danger" component="span" :can-load="false"/>
        </div>
       <template v-if="encrypted">
          <div class="dropdown-divider"></div>
          <loading-button :submit="handleLogout" text="Logout" icon="fas fa-sign-out-alt" tooltip="Return to the password screen" class-custom="cursor-pointer dropdown-item" component="span" :can-load="false"/>
        </template>

      </div>
    </div>

    <import-wallet-modal ref="refImportWalletModal"/>

  </div>

</template>

<script>
import LoadingSpinner from "src/components/utils/loading-spinner";
import LoadingButton from "../utils/loading-button";
import FileSaver from 'file-saver'
import consts from "consts/consts";
import ImportWalletModal from "src/components/wallet/import-wallet.modal";

export default {

  components: {LoadingSpinner, LoadingButton, ImportWalletModal},

  computed:{
    encrypted() {
      return this.$store.state.wallet.isEncrypted;
    }
  },

  methods: {

    handleImportWallet() {
      return this.$refs.refImportWalletModal.showModal();
    },

    async handleExportWallet() {
      if (typeof Blob === "undefined") throw "Blob Blob is not supported by your Browser. Update your Browser."

      const password = await this.$store.state.page.walletPasswordModal.showModal()
      if (password === null) return

      const jsonData = await PandoraPay.wallet.manager.exportWalletJSON(password);
      if (!jsonData) return false;

      const json = MyTextDecode(jsonData)

      const fileName = consts.name+".pandorawallet";

      const file = new Blob([json], {type: "application/json;charset=utf-8"});
      FileSaver.saveAs(file, fileName);

      return this.$store.dispatch('addToast', {
        type: 'success',
        title: `Wallet has been saved on your machine`,
        text: `The wallet has been saved in the downloads folder.`,
      });
    },

    async handleViewMnemonic() {
      const password = await this.$store.state.page.walletPasswordModal.showModal()
      if (password === null) return

      const secret = await PandoraPay.wallet.getWalletMnemonic(password)

      return this.$store.state.page.inputModal.showModal({
        title: "Secret",
        secret: {value: secret, title: `Secret Phrase (Mnemonic)`, security: 'DO NOT share these secret words with anyone! These secret words can be used to STEAL YOUR FUNDS FROM ALL YOUR ACCOUNTS' },
        button: null,
      });
    },

    async handleDeleteWallet() {

      try {

        const confirmed = await this.$store.state.page.inputModal.showModal({
          title: "Clear existing wallet?",
          alert: {type: "warning", text: "It will clear your existing wallet and you will get a new wallet!"},
          button: { text: "Yes, I confirm", icon: 'fas fa-times', class:'btn btn-falcon-danger'} })
        if (!confirmed) return

        const password = await this.$store.state.page.walletPasswordModal.showModal()
        if (password === null) return

        await this.$store.state.page.loadingModal.showModal();

        await PandoraPay.wallet.createNewWallet(password)
        this.$store.dispatch('addToast', {
          type: 'success',
          title: `New wallet`,
          text: `You got a new wallet`,
        })
      } catch (e) {
        throw e
      } finally {
        this.$store.state.page.loadingModal.closeModal();
      }

    },

    async handleImportMnemonic() {

      const mnemonic = await this.$store.state.page.inputModal.showModal({
        title: "Import Mnemonic",
        textarea: {allowEdit: true, rows: 4}, button: {text: "Import mnemonic", icon: 'fas fa-disk', class:'btn btn-primary'},
        alert: {type: "warning", text: "This operation will delete the existing wallet from your browser and will replace it with the one from the mnemonic", class:"mt-2"},
      })
      if (!mnemonic) return

      const password = await this.$store.state.page.walletPasswordModal.showModal()
      if (password === null) return

      try {

        await this.$store.state.page.loadingModal.showModal();

        const out = await PandoraPay.wallet.importMnemonic(password, mnemonic.trim());
        if (out)
          this.$store.dispatch('addToast', {
            type: 'success',
            title: `Mnemonic Imported Successfully`,
            text: `The mnemonic was imported successfully into your wallet`,
          });

      } catch (e) {
        throw e.toString()
      } finally {
        this.$store.state.page.loadingModal.closeModal();
      }

    },

    async handleLogout() {

      const out = await PandoraPay.wallet.manager.encryption.logoutWallet();
      if (!out) throw "logout was not true"

      this.$store.dispatch('addToast', {
        type: 'success',
        title: `You have been logged out!`,
        text: `You have been logged out. You need to login with the password to access your wallet.`,
      });

    },

  }


}
</script>

<style scoped>
</style>
