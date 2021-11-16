import mutations from "./transactions-mutations"
import actions from "./transactions-actions"
import getters from "./transactions-getters"

export default {

    state: {
        txsByHash: {},
        txsByHeight: {},

        subscribed: {},
        viewTxsHashes: {},
    },

    actions,
    getters,
    mutations,
}
