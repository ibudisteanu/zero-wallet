import mutations from "./mempool-mutations"
import actions from "./mempool-actions"
import Decimal from "decimal.js"

export default {

    state: {
        list: {},

        count: new Decimal(0),

        page: new Decimal(0),
        start: new Decimal(0),
    },

    mutations,
    actions,

}
