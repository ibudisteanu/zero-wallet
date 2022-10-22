<template>
  <div v-if="address">
    <div class="card mb-3">
      <div class="card-body p-0">
        <div class="row g-0 align-items-center py-2 position-relative">
          <div class="col px-1 py-1 position-static">
            <div class="account-simple-version align-items-center d-block p-2">
              <div class="avatar avatar-xxl me-sm-3 me-2">
                <account-identicon :public-key="address.publicKey" :size="$store.state.settings.mobile ? 36 : 56" :outer-size="$store.state.settings.mobile ? 8 : 20"/>
              </div>
              <div class="text-truncate">
                 <span class="fw-bold d-block text-break">
                {{ title }} - {{ walletAddress ? walletAddress.name : '' }}
                </span>
                <span >
                  {{ getAddress }}
                </span>
              </div>
              <div>
                <loading-button :submit="copyAddress" tooltip="Copy Adress" icon="fas fa-copy" class-custom="btn btn-falcon-default rounded-pill me-2 mb-1 cursor-pointer" text="" :can-load="false"/>
                <loading-button :submit="()=>showQrCode(address.publicKey)" tooltip="Show QR" icon="fas fa-qrcode" class-custom="btn btn-falcon-default rounded-pill me-2 mb-1 cursor-pointer" text="" :can-load="false"/>
                <loading-button :submit="handleDeleteAddress" tooltip="Delete Account" icon="text-danger fas fa-times" class-custom="btn btn-falcon-default rounded-pill me-2 mb-1 cursor-pointer" text="" :can-load="false"/>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <account-delete-modal ref="accountDeleteModal"/>

  </div>
</template>

<script>

import AccountIdenticon from "./account-identicon";
import LoadingButton from "src/components/utils/loading-button";
import AccountDeleteModal from "src/components/wallet/account/account-delete.modal"
import consts from "consts/consts";

export default {

  components: {
    AccountIdenticon, LoadingButton, AccountDeleteModal,
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
    showQrCode(walletAddress){
      return this.$store.state.page.QRCodeModal.showModal(this.$store.getters.addressDisplay(this.walletAddress), this.walletAddress.name || '');
    },

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

    handleDeleteAddress() {
      return this.$refs.accountDeleteModal.showModal(this.walletAddress)
    },

  },

}
</script>

<style scoped>
.account-simple-version{
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 96px 1fr 165px;
}

@media only screen and (max-width: 766px) {
  .account-simple-version{
    grid-template-columns: 50px 1fr 165px;
  }
}

</style>
