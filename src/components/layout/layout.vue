<template>


    <main :class="`main`" >

        <warning-bar v-if="$store.getters.isTestnet" />

        <div class="container" data-layout="container">

            <left-sidebar v-if="!disableLayout" ref="refSidebar" :style="`${$store.getters.isTestnet ? 'top: 50px' : ''}`" />

            <div :class="`${disableLayout ? 'row flex-center min-vh-100 py-6' : 'content'}`">

                <layout-header v-if="!disableLayout" > </layout-header>

                <slot/>

                <loading-modal ref="refLoadingModal" />
                <textarea-modal ref="refTextareaModal" />
                <confirmation-modal ref="refConfirmationModal" />
                <qr-code-modal ref="refQRCodeModal" />
                <qr-code-scanner-modal ref="refQRCodeScannerModal" />
                <testnet-faucet-modal ref="refTestnetFaucetModal" />
                <wallet-password-modal ref="refWalletPasswordModal" />
                <decrypt-balance-modal ref="refDecryptBalanceModal" />
                <secret-modal ref="refSecretModal" />
                <layout-footer v-if="!disableLayout" />

            </div>

        </div>

        <toasts />

    </main>

</template>

<script>

require('src/assets/common.css');

import LayoutHeader from "./header/layout-header";
import LayoutFooter from "./footer/layout-footer";
import LoadingModal from "./modals/loading.modal"
import TestnetFaucetModal from "./modals/testnet-faucet.modal"
import TextareaModal from "./modals/textarea.modal"
import ConfirmationModal from "./modals/confirmation.modal"
import WalletPasswordModal from "./modals/wallet-password.modal"
import DecryptBalanceModal from "./modals/decrypt-balance.modal"
import QrCodeModal from "./modals/qr-code.modal"
import LeftSidebar from "./left-sidebar/left-sidebar"
import WarningBar from "./header/warning-bar"
import Toasts from "./toasts/toasts"
import QrCodeScannerModal from "../utils/qr-code-scanner/qr-code-scanner.modal";
import SecretModal from "./modals/secret.modal"

export default {

    components: {
        LeftSidebar, LayoutHeader, LayoutFooter, LoadingModal, WarningBar, QrCodeModal, SecretModal,
        TestnetFaucetModal, WalletPasswordModal, Toasts, QrCodeScannerModal, DecryptBalanceModal, TextareaModal,
        ConfirmationModal },

    props: {
        disableLayout: {default: false},
    },

    data(){
        return {
        }
    },

    computed:{

    },

    methods:{
        storeModals(){

            if (!this.$refs.refDecryptBalanceModal) return

            this.$store.commit('setModals', {
                refLoadingModal: this.$refs.refLoadingModal,
                refTextareaModal: this.$refs.refTextareaModal,
                refConfirmationModal: this.$refs.refConfirmationModal,
                refQRCodeModal: this.$refs.refQRCodeModal,
                refQRCodeScannerModal: this.$refs.refQRCodeScannerModal,
                refTestnetFaucetModal: this.$refs.refTestnetFaucetModal,
                refWalletPasswordModal: this.$refs.refWalletPasswordModal,
                refDecryptBalanceModal: this.$refs.refDecryptBalanceModal,
                refSecretModal: this.$refs.refSecretModal,
            })
        }
    },

    mounted(){
        this.storeModals()
    }

}

</script>


<style scoped>

    @media (min-width: 576px){
        .content {
            padding-bottom: 5.5875rem;
        }
    }

</style>
