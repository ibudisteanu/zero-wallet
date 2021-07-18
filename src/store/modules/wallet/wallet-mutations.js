import Vue from 'vue';

export default {

    setLoaded( state, value){
        state.loaded = value;
    },

    setInitialized( state, value ){
        state.initialized = value;
    },

    setWallet( state, data ){
        state.version = data.version;
        state.mnemonic = data.mnemonic;
        state.seed = data.seed;
        state.seedIndex = data.seedIndex;
        state.count = data.count;
        state.countIndex = data.countIndex;
    },

    walletClear(state){

        state.loaded = false;

        state.version = null;
        state.mnemonic = null;
        state.seed = null;
        state.seedIndex = null;
        state.count = null;
        state.countIndex = null;

        state.addresses = {}

        localStorage.removeItem('mainPublicKeyHash');
    },

    setMainPublicKeyHash( state, value){
        state.mainPublicKeyHash = value;
        localStorage.setItem('mainPublicKeyHash', value);
    },

    addWalletAddress(state, address){
        Vue.set(state.addresses, address.publicKeyHash, address )
    },

    removeWalletAddress(state, address){
        Vue.delete(state.addresses, address.publicKeyHash, address )
    },

    addWalletAddresses(state, newAddresses){

        const {addresses} = state

        for (const key in newAddresses)
            addresses[key] = newAddresses[key]

        state.addresses = {...addresses}
    }

}
