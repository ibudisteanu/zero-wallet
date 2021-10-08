export default {

    async initializeFaucetInfo({state, dispatch, commit}){

        const faucetInfo = await PandoraPay.network.getNetworkFaucetInfo()
        if (!faucetInfo) throw "Couldn't get faucet info"

        commit('setFaucetInfo', JSON.parse( MyTextDecode(faucetInfo) ))
    }

}
