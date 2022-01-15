import mutations from "./mempool-mutations"
import actions from "./mempool-actions"

export default {

    state: {
        list: {},

        count: 0,

        page: 0,
        start: 0,
    },

    mutations,
    actions,

}
