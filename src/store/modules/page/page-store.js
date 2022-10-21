import mutations from "./page-mutations"
import getters from "./page-getters"

export default {

    state: {

        loadingModal: null,
        inputModal: null,
        QRCodeModal: null,
        QRCodeScannerModal: null,
        testnetFaucetModal:null,
        walletPasswordModal:null,
        decryptBalanceModal:null,
        createNewAddressModal: null,
        importAccountSecretKeyModal: null,
        importAccountModal: null,

        modalIndex: 0,

        leftSidebarShow: false,
    },

    mutations,
    getters,
}
