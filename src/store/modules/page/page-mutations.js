export default {

    setModals(state, modals ){
        state.loadingModal = modals.loadingModal;
        state.inputModal = modals.inputModal
        state.QRCodeModal = modals.QRCodeModal;
        state.QRCodeScannerModal = modals.QRCodeScannerModal;
        state.testnetFaucetModal = modals.testnetFaucetModal;
        state.walletPasswordModal = modals.walletPasswordModal;
        state.decryptBalanceModal = modals.decryptBalanceModal;
    },

    incrementModalIndex(state, value){
        state.modalIndex = state.modalIndex + value
    },

    setLeftSidebarShow(state, value){
        state.leftSidebarShow = value
    },

}
