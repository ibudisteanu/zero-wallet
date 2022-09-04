export default {

    setFaucetInfo(state, data){
        state.origin = data.origin
        state.challengeUri = data.challengeUri
        state.faucetTestnetEnabled = data.faucetTestnetEnabled
        state.faucetTestnetCoins = data.faucetTestnetCoins
    }

}
