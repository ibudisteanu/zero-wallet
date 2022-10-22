<template>

  <div class="dropdown-menu dropdown-menu-end dropdown-menu-card dropdown-menu-notification show">

    <div class="card card-notification shadow-none">
      <div class="card-header">
        <div class="row justify-content-between align-items-center">
          <div class="col-auto">
            <h6 class="card-header-title mb-0">Accounts</h6>
          </div>
        </div>
      </div>

      <div class="list-group list-group-flush fs--1">
        <div class="list-group-item div-scrollable" style="max-height:19rem">
          <div v-for="(walletAddr, index) in walletAddresses"
               :class="`notification notification-flush notification-unread ${ walletAddr.publicKey === mainPublicKey  ? 'fw-black' : ''} ` "
               :key="`wallet-address-${index}`">
            <div class="notification-body address">
              <account-identicon :address="walletAddr.addressEncoded" size="21" outer-size="7" :disable-route="true"/>
              <div class="account-title cursor-pointer " @click="setMainPublicKey(walletAddr.publicKey)">
                <span class="fw-semi-bold text-truncate">{{ walletAddr.name }} - {{walletAddress.isImported ? 'Imported Account' : 'Wallet Account: #'+walletAddress.seedIndex }}  </span>
                <span class="fw-normal text-truncate">{{ $store.getters.addressDisplay(walletAddr) }} </span>
              </div>
              <div class="account-tools">
                <i class="fas fa-copy cursor-pointer" v-tooltip.bottom="'Copy Address'" @click.stop="copyAddress( walletAddr)"/>
                <i class="fas fa-qrcode cursor-pointer mt-2" v-tooltip.bottom="'Show QR Code'" @click="showQrCode( walletAddr)"/>
              </div>
            </div>
          </div>
        </div>
        <div class="list-group-item">
          <div class="list-group-title border-bottom">Operations:</div>
          <loading-button :submit="handleCreateNewAddress" text="Create Account" icon="fas fa-plus" tooltip="Create a new Address" class-custom="cursor-pointer dropdown-item" component="span"/>
          <div class="form-check form-switch cursor-pointer dropdown-item" @click.stop="switchExpertMode" v-tooltip.bottom="`Switch between the Expert and Basic mode of the Wallet.`" >
            <input class="form-check-input cursor-pointer" type="checkbox" :checked="$store.state.settings.expert" >
            <label class="form-check-label cursor-pointer m-0">Switch Expert mode</label>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon"
import LoadingButton from "src/components/utils/loading-button";

const {version} = PandoraPay.enums.wallet.address;

export default {

  components: {LoadingButton, AccountIdenticon},

  data() {
    return {
      allowClose: false,
    }
  },

  computed: {

    walletAddress() {
      return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey];
    },

    walletAddresses() {
      return this.$store.state.wallet.addresses;
    },

    mainPublicKey() {
      return this.$store.state.wallet.mainPublicKey;
    },

  },

  methods: {

    handleCreateNewAddress() {
      return this.$store.state.page.createNewAddressModal.showModal()
    },

    setMainPublicKey(publicKey) {
      this.$store.commit('setMainPublicKey', publicKey);
    },

    async copyAddress(walletAddress) {
      const addr = this.$store.getters.addressDisplay(walletAddress)
      try{
        await this.$copyText(addr)
        this.$store.dispatch('addToast', {type: 'success', title: `Copied to clipboard successfully`, text: `Address ${addr} copied to clipboard`})
      }catch(e){
        this.$store.dispatch('addToast', {type: 'error', title: `Clipboard failed`, text: `Failed to copy to clipboard`,})
      }
    },

    switchExpertMode(){
      this.$store.commit('setExpert', !this.$store.state.settings.expert)
    },

  }

}
</script>

<style scoped>

.dropdown-menu {
  margin-top: 10px;
  right: -2.5625rem !important;
}

.dropdown-menu-notification {
  max-width: 400px;
}

.notification {
  display: block;
}

.address {
  display: grid;
  grid-template-columns: 32px 310px 30px;
  grid-column-gap: 10px;
  text-align: left;
}

.dropdown-item i {
  margin-right: 5px;
}

.account-title span,
.account-tools span, .account-tools i {
  display: block;
}

.account-tools {
  float: right;
}
.form-check-input{
  margin-left: 0;
  margin-right: 5px;
  margin-top: 5px;
}

@media (min-width: 576px) and (max-width: 1200px) {
  .dropdown-menu-notification {
    max-width: 300px;
  }
  .address {
    grid-template-columns: 32px 230px 30px;
  }
}

@media (min-width: 320px) and (max-width: 576px) {
  .dropdown-menu-notification {
    max-width: 250px;
  }
  .address {
    grid-template-columns: 32px 160px 30px;
  }
}

@media (max-width: 320px) {
  .dropdown-menu-notification {
    max-width: 200px;
    min-width: 0;
  }
  .address {
    grid-template-columns: 32px 105px 30px;
  }
}


</style>
