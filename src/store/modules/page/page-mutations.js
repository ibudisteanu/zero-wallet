export default {

    setModals(state, modals ){
        state.refLoadingModal = modals.refLoadingModal;
        state.refTextareaModal = modals.refTextareaModal
        state.refConfirmationModal = modals.refConfirmationModal
        state.refQRCodeModal = modals.refQRCodeModal;
        state.refQRCodeScannerModal = modals.refQRCodeScannerModal;
        state.refTestnetFaucetModal = modals.refTestnetFaucetModal;
        state.refWalletPasswordModal = modals.refWalletPasswordModal;
        state.refDecryptBalanceModal = modals.refDecryptBalanceModal;
        state.refSecretModal = modals.refSecretModal
    },

    incrementModalIndex(state, value){
        state.modalIndex = state.modalIndex + value
    },

    setLeftSidebarShow(state, value){
        state.leftSidebarShow = value
    },

}
