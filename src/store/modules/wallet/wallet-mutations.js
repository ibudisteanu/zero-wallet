import Vue from 'vue';

export default {

    setWallet( state, { wallet, addresses, mainPublicKeyHash } ){
        state.isEncrypted = wallet.isEncrypted
        state.version = wallet.version;
        state.mnemonic = wallet.mnemonic;
        state.seed = wallet.seed;
        state.seedIndex = wallet.seedIndex;
        state.count = wallet.count;
        state.countIndex = wallet.countIndex;

        state.initialized = true
        state.loaded = wallet.loaded

        state.addresses = addresses

        state.mainPublicKeyHash = mainPublicKeyHash
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

}
