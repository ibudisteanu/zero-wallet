import actions from "./faucet-actions"
import mutations from "./faucet-mutations"

export default {
    state:{

        hCaptchaSiteKey: null,
        faucetTestnetEnabled: false,
        faucetTestnetCoins: 0,

    },

    actions,
    mutations,
}
