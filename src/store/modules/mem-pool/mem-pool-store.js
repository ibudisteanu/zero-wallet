import mutations from "./mem-pool-mutations"
import actions from "./mem-pool-actions"

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
