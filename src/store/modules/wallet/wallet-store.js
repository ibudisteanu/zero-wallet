import mutations from "./wallet-mutations"
import getters from "./wallet-getters"
import actions from "./wallet-actions"

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
    getters,
    actions,

}