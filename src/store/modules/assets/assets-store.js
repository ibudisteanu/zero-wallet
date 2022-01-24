import mutations from "./assets-mutations"
import getters from "./assets-getters"
import actions from "./assets-actions"
import Decimal from "decimal.js"

export default {

    state: {

        list: {},
        count: new Decimal(0),

    },

    actions,
    mutations,
    getters,

}
