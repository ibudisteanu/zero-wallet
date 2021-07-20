import mutations from "./page-mutations"

export default {

    state: {

        refLoadingModal: null,
        refAccountTypeModal: null,
        refQRCodeModal: null,
        refTestnetFaucetModal:null,
        refWalletPasswordModal:null,

        modalOpened: false,

        dark: true,
        leftSidebarShow: false,

    },

    mutations,

}
