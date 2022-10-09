export default {

    setModals(state, modals ){
        state.loadingModal = modals.loadingModal;
        state.textareaModal = modals.textareaModal
        state.confirmationModal = modals.confirmationModal
        state.QRCodeModal = modals.QRCodeModal;
        state.QRCodeScannerModal = modals.QRCodeScannerModal;
        state.testnetFaucetModal = modals.testnetFaucetModal;
        state.walletPasswordModal = modals.walletPasswordModal;
        state.decryptBalanceModal = modals.decryptBalanceModal;
        state.secretModal = modals.secretModal
    },

    incrementModalIndex(state, value){
        state.modalIndex = state.modalIndex + value
    },

    setLeftSidebarShow(state, value){
        state.leftSidebarShow = value
    },

}
