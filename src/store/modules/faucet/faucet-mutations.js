export default {

    setFaucetInfo(state, data){
        state.faucetTestnetEnabled = data.faucetTestnetEnabled
        state.hCaptchaSiteKey = data.hCaptchaSiteKey
    }

}
