export default {

    setScreenInformation(state ){
        if (typeof window === "undefined" ) return
        const width = window.innerWidth
        const height = window.innerHeight

        state.width = width
        state.height = height

        state.mobile = width < 760
        state.tablet = width < 1024
    },

    setModals(state, modals ){
        state.loadingModal = modals.loadingModal
        state.inputModal = modals.inputModal
        state.QRCodeModal = modals.QRCodeModal
        state.QRCodeScannerModal = modals.QRCodeScannerModal
        state.testnetFaucetModal = modals.testnetFaucetModal
        state.walletPasswordModal = modals.walletPasswordModal
        state.decryptBalanceModal = modals.decryptBalanceModal
        state.createNewAddressModal = modals.createNewAddressModal
        state.importAccountSecretKeyModal  = modals.importAccountSecretKeyModal
        state.importAccountModal  = modals.importAccountModal
    },

    incrementModalIndex(state, value){
        state.modalIndex = state.modalIndex + value
    },

    setLeftSidebarShow(state, value){
        state.leftSidebarShow = value
    },

}
