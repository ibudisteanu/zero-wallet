<template>

  <layout>

    <layout-title icon="fas fa-wallet" title="Wallet">
      Access the private key of the selected address.
    </layout-title>

    <wait-address :address="walletAddress">

      <account :address="walletAddress"/>

      <div class="card mb-3">
        <div class="card-header bg-light">
          <div class="row align-items-center">
            <div class="col">
              <h5 class="mb-0">Account Additional Details</h5>
            </div>
          </div>
        </div>
        <div class="card-body">

          <div class="row py-2">
            <div v-if="!showPublicKey" class="cursor-pointer  w-auto" @click="showPublicKey = true">
              View Public Key
            </div>
            <div class="text-truncate" v-else>
              Public Key: {{ walletAddress.publicKey }}
              <i class="fas fa-copy cursor-pointer  d-inline-block" v-tooltip.bottom="'Copy Public Key'" @click="handleCopyAddress(walletAddress.publicKey)"/>
            </div>
          </div>

          <div class="row py-2">
            <div v-if="!showRegistration" class="cursor-pointer  w-auto" @click="showRegistration = true">
              View Registration Public Signature
            </div>
            <div class="text-truncate" v-else>
              Registration Public Signature: {{ walletAddress.registration }}
              <i class="fas fa-copy cursor-pointer  d-inline-block" v-tooltip.bottom="'Copy Registration'" @click="handleCopyAddress(walletAddress.registration)"/>
            </div>
          </div>

        </div>

        <div class="card-body bg-light">

          <loading-button :submit="handleExportAddress" tooltip="Export Account" icon="fas fa-download" class-custom="btn btn-falcon-default rounded-pill me-2 mb-1 cursor-pointer"  text=""/>
          <loading-button :submit="handleDeleteAddress" tooltip="Delete Account" icon="text-danger fas fa-times" class-custom="btn btn-falcon-default rounded-pill me-2 mb-1 cursor-pointer" text=""/>
          <loading-button :submit="handleShowSecretKey" tooltip="View Secret Key" icon="fas fa-eye" class-custom="btn btn-falcon-default rounded-pill me-2 mb-1 cursor-pointer" text=""/>
          <loading-button :submit="handleRenameAddressName" tooltip="Rename Address Tag" icon="fas fa-edit" class-custom="btn btn-falcon-default rounded-pill me-2 mb-1 cursor-pointer" text=""/>
          <loading-button :submit="handleSignMessage" tooltip="Sign message" icon="fas fa-signature" class-custom="btn btn-falcon-default rounded-pill me-2 mb-1 cursor-pointer" text=""/>

        </div>
      </div>

      <account-delete-modal ref="accountDeleteModal"/>
      <account-sign-message-modal ref="accountSignMessageModal"/>
      <account-rename-modal ref="accountRenameModal"/>

    </wait-address>

  </layout>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon";
import FileSaver from 'file-saver'
import consts from 'consts/consts';
import AccountRenameModal from "src/components/wallet/account/account-rename.modal"
import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title";
import Account from "src/components/wallet/account/account"
import AccountDeleteModal from "src/components/wallet/account/account-delete.modal"
import WaitAddress from "src/components/wallet/account/wait-address";
import AccountSignMessageModal from "src/components/wallet/account/account-sign-message-modal"
import LoadingButton from "src/components/utils/loading-button";

export default {

  components: {
    AccountSignMessageModal,LoadingButton,
    WaitAddress, AccountIdenticon, AccountRenameModal, Layout, Account, LayoutTitle, AccountDeleteModal
  },

  data() {
    return {
      showPublicKey: false,
      showRegistration: false,
    }
  },


  computed: {
    walletAddress() {
      return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey];
    }
  },

  methods: {

    async handleExportAddress() {

      if (typeof Blob === "undefined") throw "Blob Blob is not supported by your Browser. Update your Browser."

      const password = await this.$store.state.page.walletPasswordModal.showModal()
      if (password === null) return

      const jsonData = await PandoraPay.wallet.manager.getWalletAddress(password, this.walletAddress.publicKey);
      if (!jsonData) return false;

      const json = MyTextDecode(jsonData)

      const fileName = consts.name + "_" + this.walletAddress.name + "_" + this.walletAddress.addressEncoded + ".pandora";

      const file = new Blob([json], {type: "application/json;charset=utf-8"});
      FileSaver.saveAs(file, fileName);

      return this.$store.dispatch('addToast', {
        type: 'success',
        title: `Address ${this.walletAddress.name} has been saved on your machine`,
        text: `The address ${this.walletAddress.addressEncoded} has been saved in the downloads folder.`,
      });

    },

    async handleShowSecretKey() {
      const password = await this.$store.state.page.walletPasswordModal.showModal()
      if (password === null) return

      const secretKey = await PandoraPay.wallet.getWalletAddressSecretKey(password, this.walletAddress.publicKey)

      return this.$store.state.page.inputModal.showModal({
        title: "Secret Key",
        secret: { value: secretKey, title: `Secret Key of ${this.walletAddress ? this.walletAddress.name : ''}`, security: 'DO NOT share this secret key with anyone! This private key can be used to STEAL YOUR FUNDS FROM THIS ACCOUNT'},
        button: null,
      });
    },

    handleSignMessage() {
      return this.$refs.accountSignMessageModal.showModal(this.walletAddress)
    },

    handleDeleteAddress() {
      return this.$refs.accountDeleteModal.showModal(this.walletAddress)
    },

    handleRenameAddressName() {
      return this.$refs.accountRenameModal.showModal(this.walletAddress)
    },

    handleCopyAddress(key) {

      this.$copyText(key).then(
          e => this.$store.dispatch('addToast', {
            type: 'success',
            title: `Copied to clipboard successfully`,
            text: `${key} copied to clipboard`,
          }),
          e => this.$store.dispatch('addToast', {
            type: 'error',
            title: `Clipboard failed`,
            text: `Failed to copy to clipboard`,
          })
      )

    },

  },

}
</script>
