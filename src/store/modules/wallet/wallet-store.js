import mutations from "./wallet-mutations"

export default {

    state: {

        loaded: false,
        loggedIn: false,

        encrypted: null,
        version: null,

        addresses: {},
        mainAddress: null,


        isLoading: false,
    },

    mutations,

}