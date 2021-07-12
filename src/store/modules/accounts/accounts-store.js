import mutations from "./accounts-mutations"
import actions from "./accounts-actions"

export default {

    state: {
        list: {},
        txs: {},

        subscribed: {},
        viewPositions: {},

    },

    actions,
    mutations,

}
