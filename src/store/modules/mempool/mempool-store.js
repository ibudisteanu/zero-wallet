import mutations from "./mempool-mutations"
import actions from "./mempool-actions"
import Decimal from "decimal.js"

export default {

    state: {
        list: {},

        count: Decimal_0,

        page: Decimal_0,
        start: Decimal_0,
    },

    mutations,
    actions,

}
