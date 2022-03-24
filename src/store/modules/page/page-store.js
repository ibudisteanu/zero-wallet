import mutations from "./page-mutations"
import getters from "./page-getters"

export default {

    state: {

        refLoadingModal: null,
        refTextareaModal: null,
        refConfirmationModal: null,
        refQRCodeModal: null,
        refQRCodeScannerModal: null,
        refTestnetFaucetModal:null,
        refWalletPasswordModal:null,
        refDecryptBalanceModal:null,

        modalIndex: 0,

        dark: true,
        leftSidebarShow: false,

    },

    mutations,
    getters,
}
