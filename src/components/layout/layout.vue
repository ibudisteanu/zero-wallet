<template>


    <main :class="`main`" >

<!--        <warning-bar v-if="$store.getters.isTestnet" />-->

        <div class="container" data-layout="container">

            <left-sidebar v-if="!disableLayout" ref="refSidebar" />

            <div :class="`${disableLayout ? 'row flex-center min-vh-100 py-6' : 'content'}`">

                <layout-header v-if="!disableLayout" > </layout-header>

                <slot/>

                <loading-modal ref="refLoadingModal" />
                <account-type-modal ref="refAccountTypeModal" />
                <qr-code-modal ref="refQRCodeModal" />
                <qr-code-scanner-modal ref="refQRCodeScannerModal" />
                <testnet-faucet-modal ref="refTestnetFaucetModal" />
                <wallet-password-modal ref="refWalletPasswordModal" />
                <decode-homomorphic-balance-modal ref="refDecodeHomomorphicBalanceModal" />

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
import AccountTypeModal from "./modals/account-type.modal"
import TestnetFaucetModal from "./modals/testnet-faucet.modal"
import WalletPasswordModal from "./modals/wallet-password.modal"
import DecodeHomomorphicBalanceModal from "./modals/decode-homomorphic-balance.modal"
import QrCodeModal from "./modals/qr-code.modal"
import LeftSidebar from "./left-sidebar/left-sidebar"
import WarningBar from "./header/warning-bar"
import Toasts from "./toasts/toasts"
import QrCodeScannerModal from "../utils/qr-code-scanner/qr-code-scanner.modal";

export default {

    components: {AccountTypeModal, LeftSidebar, LayoutHeader, LayoutFooter, LoadingModal, WarningBar, QrCodeModal,
        TestnetFaucetModal, WalletPasswordModal, Toasts, QrCodeScannerModal, DecodeHomomorphicBalanceModal},

    props: {
        disableLayout: false,
    },

    data(){
        return {
        }
    },

    computed:{

    },

    methods:{
        storeModals(){

            if (!this.$refs.refDecodeHomomorphicBalanceModal) return

            this.$store.commit('setModals', {
                refLoadingModal: this.$refs.refLoadingModal,
                refAccountTypeModal: this.$refs.refAccountTypeModal,
                refQRCodeModal: this.$refs.refQRCodeModal,
                refQRCodeScannerModal: this.$refs.refQRCodeScannerModal,
                refTestnetFaucetModal: this.$refs.refTestnetFaucetModal,
                refWalletPasswordModal: this.$refs.refWalletPasswordModal,
                refDecodeHomomorphicBalanceModal: this.$refs.refDecodeHomomorphicBalanceModal,
            })
        }
    },

    mounted(){
        this.storeModals()
    }

}

</script>


<style scoped>

    .layout {
    }


</style>
