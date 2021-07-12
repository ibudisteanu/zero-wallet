import actions from "./blocks-actions"
import getters from "./blocks-getters"
import mutations from "./blocks-mutations"

export default {

    state: {
        blocksByHeight: {},
        blocksByHash: {},
    },

    actions,
    mutations,
    getters,
}
