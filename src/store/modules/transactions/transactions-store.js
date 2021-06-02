import mutations from "./transactions-mutations"

export default {

    state: {

        txsByHash: {},
        txsByHeight: {},

        pending: {},
        pendingNext: null,
        pendingCount: null,

    },

    mutations,

}
