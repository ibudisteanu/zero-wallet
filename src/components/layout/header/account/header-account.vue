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
        <import-account-modal ref="refImportAccountModal" />
        <import-secret-key-modal ref="refImportSecretKeyModal" />
        <create-new-address-modal ref="refCreateNewAddressModal" />

    </div>

</template>

<script>

import HeaderAccountDropdownMenu from "./header-account-dropdown-menu"
import AccountIdenticon from "src/components/wallet/account/account-identicon"
import ImportAccountModal from "src/components/wallet/account/import-account.modal"
import ImportSecretKeyModal from "src/components/wallet/account/import-secret-key.modal"
import CreateNewAddressModal from "src/components/wallet/account/create-new-address.modal"
import UtilsHelper from "src/utils/utils-helper";

export default {

    components: { HeaderAccountDropdownMenu, AccountIdenticon, ImportAccountModal,
      ImportSecretKeyModal, CreateNewAddressModal },

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

        async viewMnemonic(){
          const password = await this.$store.state.page.refWalletPasswordModal.showModal()
          if (password === null ) return

          const secret = await PandoraPay.wallet.getWalletMnemonic( password )

          return this.$store.state.page.refSecretModal.showModal(secret, `Secret Phrase (Mnemonic)`, 'DO NOT share these secret words with anyone! These secret words can be used to STEAL YOUR FUNDS FROM ALL YOUR ACCOUNTS');
        },

        async viewSeed(){
          const password = await this.$store.state.page.refWalletPasswordModal.showModal()
          if (password === null ) return

          const secret = await PandoraPay.wallet.getWalletSeed( password )

          return this.$store.state.page.refSecretModal.showModal(secret, `Secret Seed`, 'DO NOT share this secret seed with anyone! This secret seed can be used to STEAL YOUR FUNDS FROM ALL YOUR ACCOUNTS');
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

          try{

            const confirmed = await this.$store.state.page.refConfirmationModal.showModal("Clear existing wallet?", "It will clear your existing wallet and you will get a new wallet!")
            if (!confirmed) return

            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            this.$store.state.page.refLoadingModal.showModal();
            await UtilsHelper.sleep(50 )

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
            this.$store.state.page.refLoadingModal.closeModal();
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
