import mutations from "./wallet-mutations"

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

        mainPublicKeyHash: null,

    },

    mutations,

}
