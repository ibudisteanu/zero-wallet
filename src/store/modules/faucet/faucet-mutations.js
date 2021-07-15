export default {

    setFaucetInfo(state, data){
        state.hCaptchaSiteKey = data.hCaptchaSiteKey
        state.faucetTestnetEnabled = data.faucetTestnetEnabled
        state.faucetTestnetCoins = data.faucetTestnetCoins
    }

}
