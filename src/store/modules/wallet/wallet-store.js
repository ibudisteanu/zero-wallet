import mutations from "./wallet-mutations"
import getters from "./wallet-getters"

export default {

    state: {

        initialized: false, //wasm wallet initialized
        loaded: false, //wasm wallet decrypted

        version: null,
        mnemonic: null,
        seed: null,
        seedIndex: null,
        count: null,
        countIndex: null,

        encrypted: null,

        addresses: {},

        mainPublicKeyHash: null,

    },

    getters,
    mutations,

}
