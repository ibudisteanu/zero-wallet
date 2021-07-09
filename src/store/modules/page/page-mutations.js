export default {

    setDark(context, ){

        const toggle = !context.dark

        context.dark = toggle;
        if (context.dark) {
            document.getElementsByTagName("html")[0].classList.add('dark');
        } else {
            document.getElementsByTagName("html")[0].classList.remove('dark');
        }
    },

    setLoadingModal(context, ref){
        context.refLoadingModal = ref;
    },

    setAccountTypeModal(context, ref){
        context.refAccountTypeModal = ref;
    },

    setModalOpened(context, value){
        context.modalOpened = value
    }

}
