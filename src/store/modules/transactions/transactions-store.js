import mutations from "./transactions-mutations"
import actions from "./transactions-actions"

export default {

    state: {
        txsByHash: {},
        txsByHeight: {},

        subscribed: {},
        viewTxsHashes: {},
    },

    actions,
    mutations,
}
