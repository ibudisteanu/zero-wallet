<template>

    <div class="account" v-if="walletAddress">

        <div class="toggle unselectable" @click.stop="toggleMenu" >
            <account-identicon :address="$store.getters.addressDisplay(this.walletAddress)" size="21" outer-size="7" :disable-route="true" :show-tooltip="!menuOpen" />
            <i class="right-float chevron-down fas fa-chevron-down"></i>
        </div>

        <div class="menu" >
            <header-account-dropdown-menu v-if="menuOpen" @viewMnemonic="viewMnemonic" @newWallet="newWallet" @importMnemonic="importMnemonic" @viewSeed="viewSeed" @showCreateNewAddress="showCreateNewAddress" @showImportAccount="showImportAccount" @showImportSecretKey="showImportSecretKey" />
        </div>

        <wallet-seed-modal ref="refWalletSeedModal" />
        <wallet-mnemonic-modal ref="refWalletMnemonicModal" />
        <import-account-modal ref="refImportAccountModal" />
        <import-secret-key-modal ref="refImportSecretKeyModal" />
        <create-new-address-modal ref="refCreateNewAddressModal" />

    </div>

</template>

<script>

import HeaderAccountDropdownMenu from "./header-account-dropdown-menu"
import AccountIdenticon from "src/components/wallet/account/account-identicon"
import WalletSeedModal from "src/components/wallet/seed/wallet-seed-modal"
import WalletMnemonicModal from "src/components/wallet/seed/wallet-mnemonic-modal"
import ImportAccountModal from "src/components/wallet/account/import-account.modal"
import ImportSecretKeyModal from "src/components/wallet/account/import-secret-key.modal"
import CreateNewAddressModal from "src/components/wallet/account/create-new-address.modal"

export default {

    components: { HeaderAccountDropdownMenu, AccountIdenticon, WalletSeedModal, ImportAccountModal,
      ImportSecretKeyModal, CreateNewAddressModal, WalletMnemonicModal },

    data(){
        return {
            menuOpen: false,
        }
    },

    computed: {

        walletAddress(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey];
        },

    },

    methods:{

        toggleMenu(){
            if (!this.menuOpen) this.$emit('closeOtherMenus')
            this.menuOpen = !this.menuOpen;
        },

        closeMenu(){
            this.menuOpen = false;
        },

        viewMnemonic(){
            return this.$refs.refWalletMnemonicModal.showModal(  );
        },

        viewSeed(){
          return this.$refs.refWalletSeedModal.showModal(  );
        },

        showImportAccount(){
            return this.$refs.refImportAccountModal.showModal( );
        },

        showImportSecretKey(){
            return this.$refs.refImportSecretKeyModal.showModal( );
        },

        showCreateNewAddress(){
          return this.$refs.refCreateNewAddressModal.showModal()
        },

        async newWallet(){
          const confirmed = await this.$store.state.page.refConfirmationModal.showModal("Clear existing wallet?", "It will clear your existing wallet and you will get a new wallet!")
          if (!confirmed) return

          const password = await this.$store.state.page.refWalletPasswordModal.showModal()
          if (password === null ) return

          try{
            await PandoraPay.wallet.createNewWallet(password)
            this.$store.dispatch('addToast', {
              type: 'success',
              title: `New wallet`,
              text: `You got a new wallet`,
            })
          }catch(err){
            this.$store.dispatch('addToast', {
              type: 'error',
              title: `Error creating a new wallet`,
              text: `Raised an error ${err.message}`,
            })
          }finally{

          }
        },

        async importMnemonic(){

        },

    },

}

</script>

<style scoped>

    .chevron-down{
        font-size: 10px;
    }

    .menu{
        position: absolute;
    }

    .toggle{
        cursor: pointer;
    }

</style>
