<template>

  <div class="dropdown-menu dropdown-menu-end dropdown-menu-card dropdown-menu-notification show">

    <div class="card card-notification shadow-none">
      <div class="card-header">
        <div class="row justify-content-between align-items-center">
          <div class="col-auto">
            <h6 class="card-header-title mb-0">Wallet</h6>
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
                <span class="fw-semi-bold text-truncate">{{ walletAddr.name }} - {{walletAddress.isImported ? 'Imported Account' : 'Wallet Account: #'+walletAddress.seedIndex}}  </span>
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
          <loading-button :submit="handleViewAccount" text="View Account" icon="fa fa-cursor-pointer " tooltip="View account" class-custom="cursor-pointer dropdown-item" component="span"/>
          <loading-button :submit="handleCreateNewAddress" text="Create Account" icon="fas fa-plus" tooltip="Create a new Address" class-custom="cursor-pointer dropdown-item" component="span"/>
          <loading-button :submit="handleImportAccount" text="Import Account (json)" icon="fas fa-upload" tooltip="Import an address from json file" class-custom="cursor-pointer dropdown-item" component="span"/>
          <loading-button :submit="handleImportAccountSecretKey" text="Import Account Secret Key" icon="fas fa-upload" tooltip="Import an address from Secret Key" class-custom="cursor-pointer dropdown-item" component="span"/>
          <div class="dropdown-divider"></div>
          <loading-button :submit="handleViewMnemonic" text="View Secret Phrase" icon="fas fa-key" tooltip="Show your Secret Words (Mnemonic)" class-custom="cursor-pointer dropdown-item" component="span"/>
          <loading-button :submit="handleImportMnemonic" text="Import Secret Phrase" icon="fas fa-file-import" tooltip="Clear wallet & import a new wallet from Secret Words (Mnemonic)" class-custom="cursor-pointer dropdown-item" class-text="" component="span" />
          <div class="dropdown-divider"></div>
          <loading-button :submit="handleExportWallet" text="Export Wallet" icon="fas fa-download" tooltip="Export your wallet to your computer" class-custom="cursor-pointer dropdown-item" component="span"/>
          <loading-button :submit="handleImportWallet" text="Import Wallet" icon="fas fa-upload" tooltip="Import a pandora wallet from your computer" class-custom="cursor-pointer dropdown-item" component="span"/>
          <div class="form-check form-switch cursor-pointer dropdown-item" @click.stop="switchExpertMode" v-tooltip.bottom="`Switch between the Expert and Basic mode of the Wallet.`" >
            <input class="form-check-input cursor-pointer" type="checkbox" :checked="$store.state.settings.expert" >
            <label class="form-check-label cursor-pointer m-0">Switch Expert mode</label>
          </div>
          <div class="dropdown-divider"></div>
          <loading-button v-if="!encrypted" submit="" text="Set Password" icon="fas fa-lock" tooltip="Encrypt your wallet by setting a Password" class-custom="cursor-pointer dropdown-item" component="span"/>
          <loading-button v-else submit="" text="Remove Password" icon="fas fa-unlock" tooltip="Decrypt your wallet by removing the Password" class-custom="cursor-pointer dropdown-item" component="span"/>
          <loading-button :submit="handleDeleteWallet" text="Delete Wallet" icon="fas fa-trash" tooltip="Clear & create new wallet" class-custom="cursor-pointer dropdown-item text-danger" component="span" />
          <template v-if="encrypted">
            <div class="dropdown-divider"></div>
            <loading-button :submit="handleLogout" text="Logout" icon="fas fa-sign-out-alt" tooltip="Return to the password screen" class-custom="cursor-pointer dropdown-item" component="span"/>
          </template>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon"
import FileSaver from 'file-saver'
import consts from "consts/consts";
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

    encrypted() {
      return this.$store.state.wallet.isEncrypted;
    }


  },

  methods: {

    handleViewAccount() {
      this.$router.push('/address/' + this.walletAddress.addressEncoded)
    },

    handleCreateNewAddress() {
      return this.$emit('showCreateNewAddress')
    },

    setMainPublicKey(publicKey) {
      this.$store.commit('setMainPublicKey', publicKey);
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
      if (!mnemonic) throw "Canceled"

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

    handleImportAccount() {
      return this.$emit('showImportAccount');
    },

    handleImportAccountSecretKey() {
      return this.$emit('showImportAccountSecretKey');
    },

    async handleExportWallet() {
      if (typeof Blob === "undefined") throw "Blob Blob is not supported by your Browser. Update your Browser."

      const password = await this.$store.state.page.walletPasswordModal.showModal()
      if (password === null) return

      const jsonData = await PandoraPay.wallet.manager.exportWalletJSON(password);
      if (!jsonData) return false;

      const json = MyTextDecode(jsonData)

      const fileName = consts.name + "_" + this.walletAddress.addressEncoded + ".pandorawallet";

      const file = new Blob([json], {type: "application/json;charset=utf-8"});
      FileSaver.saveAs(file, fileName);

      return this.$store.dispatch('addToast', {
        type: 'success',
        title: `Wallet has been saved on your machine`,
        text: `The wallet has been saved in the downloads folder.`,
      });
    },

    handleImportWallet() {
      return this.$emit('showImportWallet')
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

    showQrCode(walletAddress){
      return this.$store.state.page.QRCodeModal.showModal(this.$store.getters.addressDisplay(this.walletAddress), this.walletAddress.name || '');
    }

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
