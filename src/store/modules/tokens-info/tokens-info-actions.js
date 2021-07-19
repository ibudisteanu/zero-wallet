const promises = {}

export default {

    async getTokenInfoByHash( {state, dispatch, commit}, hash){

        if (!hash.length) hash = PandoraPay.config.coins.NATIVE_TOKEN_FULL_STRING_HEX

        if (state.list[hash]) return state.list[hash]
        if (promises[hash]) return promises[hash];
        return state[hash] = new Promise( async (resolve, reject) => {
            try{

                const tokenInfoData = await PandoraPay.network.getNetworkTokenInfo(hash);
                const tokenInfo = JSON.parse(tokenInfoData)

                if (!tokenInfo ) throw "Error getting block info"

                tokenInfo.hash = hash
                commit('setTokenInfo', tokenInfo)

                resolve(tokenInfo)
            }catch(err){
                reject(err)
            }
            finally{
                delete promises[hash]
            }
        })
    }

}
