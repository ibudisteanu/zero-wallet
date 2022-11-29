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

        mobile: false,
        tablet: false,
        width: 0,
        height: 0,

        modalIndex: 0,

        leftSidebarShow: false,
    },

    mutations,
    getters,
}
