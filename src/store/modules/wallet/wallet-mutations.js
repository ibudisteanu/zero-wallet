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

    setAddresses( context, value){
        context.addresses = value;
    },

    setAddressWalletBalances(context, {account, balances, nonce}){

        const address = {...context.addresses[account]};

        address.balances = balances;
        address.nonce = nonce;
        address.loaded = true;

        Vue.set(context.addresses, account, address );

    },

    setMainAddress( context, value){
        context.mainAddress = value;
        localStorage.setItem('mainAddress', value);
    },
    setLoaded(context, value){
        context.loaded = value;
    },

    setIsLoading(context, value){
        context.isLoading = value;
    },

    walletClear(context){

        context.loaded = false;
        context.loggedIn = false;
        context.encrypted = null;
        context.version = null;
        context.addresses = {};
        context.mainAddress = null;

        context.isLoading = false;

        localStorage.removeItem('mainAddress');
    }
}