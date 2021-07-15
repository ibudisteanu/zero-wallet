import mutations from "./page-mutations"

export default {

    state: {

        refLoadingModal: null,
        refAccountTypeModal: null,
        refQRCodeModal: null,
        refTestnetFaucetModal:null,

        modalOpened: false,

        dark: false,
        leftSidebarShow: false,

    },

    mutations,

}
