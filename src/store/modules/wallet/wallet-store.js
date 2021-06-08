import mutations from "./wallet-mutations"
import getters from "./wallet-getters"

export default {

    state: {

        loaded: false,
        loggedIn: false,

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
