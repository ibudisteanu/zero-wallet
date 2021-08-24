import Vue from 'vue';

export default {

    setWallet( state, { wallet, addresses, mainPublicKey } ){
        state.isEncrypted = wallet.isEncrypted
        state.version = wallet.version;
        state.seed = wallet.seed;
        state.seedIndex = wallet.seedIndex;
        state.count = wallet.count;
        state.countIndex = wallet.countIndex;

        state.initialized = true
        state.loaded = wallet.loaded

        state.addresses = addresses

        state.mainPublicKey = mainPublicKey
    },

    setMainPublicKey( state, value){
        state.mainPublicKey = value;
        localStorage.setItem('mainPublicKey', value);
    },

    addWalletAddress(state, address){
        Vue.set(state.addresses, address.publicKey, address )
    },

    removeWalletAddress(state, address){
        Vue.delete(state.addresses, address.publicKey, address )
    },

}
