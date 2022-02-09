export default {

    setModals(state, modals ){
        state.refLoadingModal = modals.refLoadingModal;
        state.refQRCodeModal = modals.refQRCodeModal;
        state.refQRCodeScannerModal = modals.refQRCodeScannerModal;
        state.refTestnetFaucetModal = modals.refTestnetFaucetModal;
        state.refWalletPasswordModal = modals.refWalletPasswordModal;
        state.refDecryptBalanceModal = modals.refDecryptBalanceModal;
    },

    incrementModalIndex(state, value){
        state.modalIndex = state.modalIndex + value
    },

    setLeftSidebarShow(state, value){
        state.leftSidebarShow = value
    },

}
