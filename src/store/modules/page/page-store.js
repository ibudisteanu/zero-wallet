import mutations from "./page-mutations"

export default {

    state: {

        refLoadingModal: null,
        refAccountTypeModal: null,
        refQRCodeModal: null,
        refQRCodeScannerModal: null,
        refTestnetFaucetModal:null,
        refWalletPasswordModal:null,

        modalIndex: 0,

        dark: true,
        leftSidebarShow: false,

    },

    mutations,

}
