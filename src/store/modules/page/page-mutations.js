export default {

    setDark(state, value ){

        state.dark = value;
        if (value) {
            document.getElementsByTagName("html")[0].classList.add('dark');
            if (typeof localStorage !== "undefined") localStorage.setItem('dark', 'true' )
        } else {
            document.getElementsByTagName("html")[0].classList.remove('dark');
            if (typeof localStorage !== "undefined") localStorage.removeItem('dark')
        }
    },

    setLoadingModal(state, ref){
        state.refLoadingModal = ref;
    },

    setAccountTypeModal(state, ref){
        state.refAccountTypeModal = ref;
    },

    setQRCodeModal(state, ref){
        state.refQRCodeModal = ref;
    },

    setTestnetFaucetModal(state, ref){
        state.refTestnetFaucetModal = ref;
    },

    setModalOpened(state, value){
        state.modalOpened = value
    },

    setLeftSidebarShow(state, value){
        state.leftSidebarShow = value
    },

}
