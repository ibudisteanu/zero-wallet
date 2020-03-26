import Vue from 'vue';

export default {

    setLoggedIn( context, value){
        context.loggedIn = value;
    },

    setEncrypted( context, value ){
        context.encrypted = value;
    },
    setVersion( context, value){
        context.version = value;
    },

    walletClear(context){

        context.loaded = false;
        context.loggedIn = false;
        context.encrypted = null;
        context.version = null;
        context.mainAddress = null;

        this.$store.state.page.refLoadingModal.closeModal();

        localStorage.removeItem('mainAddress');
    },

    setMainAddress( context, value){
        context.mainAddress = value;
        localStorage.setItem('mainAddress', value);
    },
}