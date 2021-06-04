import Vue from 'vue';

export default {

    setLoggedIn( context, value){
        context.loggedIn = value;
    },

    setEncrypted( context, value ){
        context.encrypted = value;
    },

    setWallet( context, data ){
        context.version = data.version;
        context.mnemonic = data.mnemonic;
        context.seed = data.seed;
        context.seedIndex = data.seedIndex;
        context.count = data.count;
        context.countIndex = data.countIndex;
    },

    setLoaded(context, value){
        context.loaded = value;
    },

    walletClear(context){

        context.loaded = false;

        context.version = null;
        context.mnemonic = null;
        context.seed = null;
        context.seedIndex = null;
        context.count = null;
        context.countIndex = null;

        localStorage.removeItem('mainPublicKeyHash');
    },

    setMainPublicKeyHash( context, value){
        context.mainPublicKeyHash = value;
        localStorage.setItem('mainPublicKeyHash', value);
    },
}
