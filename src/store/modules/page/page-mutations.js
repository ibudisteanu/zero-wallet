export default {

    setDark(context, value ){

        context.dark = value;
        if (value) {
            document.getElementsByTagName("html")[0].classList.add('dark');
            if (typeof localStorage !== "undefined") localStorage.setItem('dark', 'true' )
        } else {
            document.getElementsByTagName("html")[0].classList.remove('dark');
            if (typeof localStorage !== "undefined") localStorage.removeItem('dark')
        }
    },

    setLoadingModal(context, ref){
        context.refLoadingModal = ref;
    },

    setAccountTypeModal(context, ref){
        context.refAccountTypeModal = ref;
    },

    setQRCodeModal(context, ref){
        context.refQRCodeModal = ref;
    },

    setModalOpened(context, value){
        context.modalOpened = value
    }

}
