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
                <account-identicon :public-key="address.publicKey" :size="$store.state.page.mobile ? 36 : 56"
                                   :outer-size="$store.state.page.mobile ? 8 : 20" route="" />
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
        <div class="p-3" v-if="account && account.registration && $store.state.settings.expert">
          <div>
            <small class="fs--1 text-700"> Staked: {{ account.registration.staked ? 'Yes' : 'No' }} </small>
          </div>
          <div >
            <small class="fs--1 text-700"> Spend Public Key: {{ account.registration.spendPublicKey }} </small>
          </div>
        </div>
        <div class="card-footer bg-light g-0 d-block p-3">
          <div class="two-buttons">
            <loading-button :disabled="!walletAddress" :submit="handleRenameAddressName" text="Rename Address" icon="fas fa-edit" class-custom="cursor-pointer dropdown-item" component="span" :can-load="false"/>
            <loading-button :submit="showAccountQRCode" icon="fas fa-qrcode" text="Show QR Code" class-custom="cursor-pointer dropdown-item" :can-load="false" />
          </div>
          <div class="dropdown-divider"></div>
          <div class="two-buttons">
            <loading-button :disabled="!walletAddress" :submit="handleExportAddress" text="Export Account" icon="fas fa-upload" class-custom="cursor-pointer dropdown-item" :can-load="false"/>
            <loading-button :disabled="!walletAddress" :submit="handleShowSecretKey" text="View Secret Key" icon="fas fa-eye" class-custom="cursor-pointer dropdown-item"  :can-load="false" />
          </div>
          <div class="dropdown-divider"></div>
          <div class="two-buttons">
            <loading-button :disabled="!walletAddress || !account || !account.registration || !account.registration.staked" :submit="showShareStaked" icon="fas fa-piggy-bank" text="Share staked address" tooltip="Share staked address with a delegator node" class-custom="cursor-pointer dropdown-item" :can-load="false"/>
            <loading-button :disabled="!walletAddress" :submit="handleDeleteAddress" text="Delete Account" icon="fas fa-times" class-custom="text-danger cursor-pointer dropdown-item" :can-load="false"/>
          </div>
          <div class="dropdown-divider"></div>
          <div class="row" v-if="$store.state.settings.expert">
            <div class="col-12 col-md-4">
              <loading-button :submit="showGenerateCustomAddress" icon="fas fa-tools" text="Generate custom address" class-custom="cursor-pointer dropdown-item" :can-load="false"/>
            </div>
            <div class="col-12 col-md-4">
              <loading-button class="col-12 col-md-4" :submit="showAddressJSON" icon="fas fa-file" text="Show JSON address" class-custom="cursor-pointer dropdown-item" :can-load="false"/>
            </div>
            <div class="col-12 col-md-4">
              <loading-button class="col-12 col-md-4" :disabled="!walletAddress" :submit="handleSignMessage" text="Sign message" icon="fas fa-signature" class-custom="cursor-pointer dropdown-item" :can-load="false"/>
            </div>
          </div>
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
    AccountGenerateCustomAddressModal, AccountIdenticon, LoadingButton, SharedStakedDelegatorNodeModal,
    AccountRenameModal, AccountDeleteModal, AccountSignMessageModal
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
