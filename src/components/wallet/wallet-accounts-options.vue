<template>

  <div class="card mb-3  overflow-hidden">
    <div class="card-header bg-light">
      <div class="row align-items-center">
        <div class="col">
          <h5 class="mb-0">
            Accounts Options
          </h5>
        </div>
      </div>
    </div>
    <div class="card-body p-0" >
      <div class="card-footer g-0 d-block p-3">
        <div class="two-buttons">
          <loading-button :submit="handleImportAccount" text="Import Account (json)" icon="fas fa-upload" tooltip="Import an address from json file" class-custom="cursor-pointer dropdown-item" component="span" :can-load="false"/>
          <loading-button :submit="handleImportAccountSecretKey" text="Import Account (Secret Key)" icon="fas fa-upload" tooltip="Import an address from Secret Key" class-custom="cursor-pointer dropdown-item" component="span" :can-load="false"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import LoadingSpinner from "src/components/utils/loading-spinner";
import LoadingButton from "../utils/loading-button";

export default {

  components: {LoadingSpinner, LoadingButton},

  computed:{
    encrypted() {
      return this.$store.state.wallet.isEncrypted;
    }
  },

  methods: {

    handleCreateNewAddress() {
      return this.$store.state.page.createNewAddressModal.showModal()
    },

    handleImportAccount() {
      return this.$store.state.page.importAccountModal.showModal()
    },

    handleImportAccountSecretKey() {
      return this.$store.state.page.importAccountSecretKeyModal.showModal()
    },

  }


}
</script>

<style scoped>
</style>
