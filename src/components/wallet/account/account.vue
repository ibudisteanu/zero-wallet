<template>
  <div v-if="address">
    <div class="card mb-3">
      <div class="card-header bg-light">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="mb-0">{{ title }} {{ walletAddress ? walletAddress.name : '' }}</h5>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="row g-0 align-items-center py-2 position-relative">
          <div class="col px-1 py-1 position-static">
            <div class="d-flex align-items-center d-block p-2">
              <div class="avatar avatar-xxl me-sm-3 me-2">
                <account-identicon :public-key="address.publicKey" :size="$store.state.settings.mobile ? 36 : 56"
                                   :outer-size="$store.state.settings.mobile ? 8 : 20"/>
              </div>
              <span class="fw-bold d-block text-break">
                {{ getAddress }}
                <i class="fas fa-copy cursor-pointer " @click="copyAddress" v-tooltip.bottom="'Copy Address'"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="p-3" v-if="account && account.plainAccount">
          <small class="fs--1 text-700">
            Nonce: {{ account.plainAccount.nonce }}
          </small>
        </div>
        <div class="p-3" v-if="account && account.registration">
          <div>
            <small class="fs--1 text-700"> Staked: {{ account.registration.staked ? 'Yes' : 'No' }} </small>
          </div>
          <div>
            <small class="fs--1 text-700"> Spend Public Key: {{ account.registration.spendPublicKey }} </small>
          </div>
        </div>
        <div class="card-footer bg-light g-0 d-block p-3">
          <loading-button :submit="showAccountQRCode" icon="fas fa-qrcode" tooltip="Show Address QR Code" text="" class-custom="btn btn-falcon-default rounded-pill me-1 mb-1 cursor-pointer"/>
          <loading-button v-if="$store.state.settings.expert" :submit="showGenerateCustomAddress" icon="fas fa-tools" tooltip="Generate custom address" text="" class-custom="btn btn-falcon-default rounded-pill me-1 mb-1 cursor-pointer"/>
          <loading-button v-if="$store.state.settings.expert" :submit="showAddressJSON" icon="fas fa-file" tooltip="Show JSON address" text="" class-custom="btn btn-falcon-default rounded-pill me-1 mb-1 cursor-pointer"/>
          <loading-button :disabled="!walletAddress || !account || !account.registration || !account.registration.staked" :submit="showShareStaked" text="" icon="fas fa-piggy-bank" tooltip="Share staked address with a delegator node" class-custom="btn btn-falcon-default rounded-pill me-1 mb-1 cursor-pointer"/>
          <loading-button :disabled="!walletAddress" :submit="handleExportAddress" tooltip="Export Account" icon="fas fa-download" class-custom="btn btn-falcon-default rounded-pill me-2 mb-1 cursor-pointer" text=""/>
          <loading-button :disabled="!walletAddress" :submit="handleDeleteAddress" tooltip="Delete Account" icon="text-danger fas fa-times" class-custom="btn btn-falcon-default rounded-pill me-2 mb-1 cursor-pointer" text=""/>
          <loading-button :disabled="!walletAddress" :submit="handleShowSecretKey" tooltip="View Secret Key" icon="fas fa-eye" class-custom="btn btn-falcon-default rounded-pill me-2 mb-1 cursor-pointer" text=""/>
          <loading-button :disabled="!walletAddress" :submit="handleRenameAddressName" tooltip="Rename Address Tag" icon="fas fa-edit" class-custom="btn btn-falcon-default rounded-pill me-2 mb-1 cursor-pointer" text=""/>
          <loading-button v-if="$store.state.settings.expert" :disabled="!walletAddress" :submit="handleSignMessage" tooltip="Sign message" icon="fas fa-signature" class-custom="btn btn-falcon-default rounded-pill me-2 mb-1 cursor-pointer" text=""/>
        </div>
      </div>
    </div>

    <account-generate-custom-address-modal ref="refGenerateCustomAddressModal"/>
    <shared-staked-delegator-node-modal ref="refSharedStakedDelegatorNodeModal"/>
    <account-delete-modal ref="accountDeleteModal"/>
    <account-sign-message-modal ref="accountSignMessageModal"/>
    <account-rename-modal ref="accountRenameModal"/>

  </div>
</template>

<script>

import AccountIdenticon from "./account-identicon";
import AccountGenerateCustomAddressModal from "./account-generate-custom-address.modal"
import LoadingButton from "src/components/utils/loading-button";
import SharedStakedDelegatorNodeModal from "src/components/staking/shared-staked-delegator-node.modal"
import AccountSignMessageModal from "src/components/wallet/account/account-sign-message-modal"
import AccountDeleteModal from "src/components/wallet/account/account-delete.modal"
import AccountRenameModal from "src/components/wallet/account/account-rename.modal"
import consts from "consts/consts";
import FileSaver from 'file-saver'

export default {

  components: {
    AccountGenerateCustomAddressModal, AccountIdenticon, LoadingButton,
    SharedStakedDelegatorNodeModal, AccountRenameModal, AccountDeleteModal,
    AccountSignMessageModal
  },

  props: {
    address: {default: null},
    title: {default: "Account details"},
  },

  computed: {
    account() {
      return this.$store.state.accounts.list[this.address.publicKey]
    },
    getAddress() {
      return this.$store.getters.addressDisplay(this.address)
    },
    walletAddress() {
      return this.$store.state.wallet.addresses[this.address.publicKey]
    },
  },

  methods: {
    copyAddress() {

      this.$copyText(this.getAddress).then(
          e => this.$store.dispatch('addToast', {
            type: 'success',
            title: `Copied to clipboard successfully`,
            text: `Address ${this.getAddress} copied to clipboard`,
          }),
          e => this.$store.dispatch('addToast', {
            type: 'error',
            title: `Clipboard failed`,
            text: `Failed to copy to clipboard`,
          })
      )

    },

    showGenerateCustomAddress() {
      return this.$refs.refGenerateCustomAddressModal.showModal(this.address);
    },

    showAccountQRCode() {
      return this.$store.state.page.QRCodeModal.showModal(this.getAddress, this.address.name || '');
    },

    showAddressJSON() {
      return this.$store.state.page.inputModal.showModal({
        title: "ADDRESS JSON", data: JSONStringify(this.account, null, 2),
        textarea: {allowEdit: false, class: "form-control-sm fs--2", rows: 15}, button: null
      })
    },

    showShareStaked() {
      return this.$refs.refSharedStakedDelegatorNodeModal.showModal(this.address.publicKey)
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

  },

}
</script>

<style scoped>

</style>
