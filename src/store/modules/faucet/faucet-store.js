import actions from "./faucet-actions"
import mutations from "./faucet-mutations"

export default {
    state:{

        hcaptchaSiteKey: "",
        faucetTestnetEnabled: false,
        faucetTestnetCoins: 0,

    },

    actions,
    mutations,
}
