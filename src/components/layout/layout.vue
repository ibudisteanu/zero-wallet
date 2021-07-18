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
                <testnet-faucet-modal ref="refTestnetFaucetModal" />
                <wallet-password-modal ref="refWalletPasswordModal" />

                <layout-footer v-if="!disableLayout" />

            </div>

        </div>
    </main>

</template>

<script>

require('src/assets/common.css');

import LayoutHeader from "./header/layout-header.vue";
import LayoutFooter from "./footer/layout-footer.vue";
import LoadingModal from "./modals/loading.modal"
import AccountTypeModal from "./modals/account-type.modal"
import TestnetFaucetModal from "./modals/testnet-faucet.modal"
import WalletPasswordModal from "./modals/wallet-password.modal"
import QrCodeModal from "./modals/qr-code.modal"
import LeftSidebar from "./left-sidebar/left-sidebar"
import WarningBar from "./header/warning-bar"

export default {

    components: {AccountTypeModal, LeftSidebar, LayoutHeader, LayoutFooter, LoadingModal, WarningBar, QrCodeModal, TestnetFaucetModal, WalletPasswordModal},

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

    },

    mounted(){
        this.$store.commit('setLoadingModal', this.$refs.refLoadingModal);
        this.$store.commit('setAccountTypeModal', this.$refs.refAccountTypeModal);
        this.$store.commit('setQRCodeModal', this.$refs.refQRCodeModal);
        this.$store.commit('setTestnetFaucetModal', this.$refs.refTestnetFaucetModal);
        this.$store.commit('setWalletPasswordModal', this.$refs.refWalletPasswordModal);
    }

}

</script>


<style scoped>

    .layout {
    }


</style>
