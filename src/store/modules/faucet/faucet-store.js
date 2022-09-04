import actions from "./faucet-actions"
import mutations from "./faucet-mutations"
import Decimal from "decimal.js"

export default {
    state:{

        origin: null,
        challengeUri: null,
        faucetTestnetEnabled: false,
        faucetTestnetCoins: new Decimal(0),

    },

    actions,
    mutations,
}
