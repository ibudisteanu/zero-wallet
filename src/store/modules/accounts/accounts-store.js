import mutations from "./accounts-mutations"
import getters from "./accounts-getters"
import actions from "./accounts-actions"

export default {

    state: {

        list: {},

        subscribed: {},
    },

    actions,
    getters,
    mutations,

}
