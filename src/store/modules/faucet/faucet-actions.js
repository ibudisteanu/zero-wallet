export default {

    async initializeFaucetInfo({state, dispatch, commit}){

        const faucetInfo = await PandoraPay.network.getNetworkFaucetInfo()
        console.log("faucetInfo", faucetInfo)

        commit('setFaucetInfo', JSON.parse(faucetInfo))
    }

}
