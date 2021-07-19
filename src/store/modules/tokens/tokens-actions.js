const promises = {}

export default {

    async getTokenByHash( {state, dispatch, commit}, hash){

        if (!hash.length) hash = PandoraPay.config.coins.NATIVE_TOKEN_FULL_STRING_HEX

        if (state.list[hash]) return state.list[hash]
        if (promises[hash]) return promises[hash];
        return promises[hash] = new Promise( async (resolve, reject) => {
            try{
                const tokenData = await PandoraPay.network.getNetworkToken(hash);
                const token = JSON.parse(tokenData)

                if (!token ) throw "Error getting block info"

                token.hash = hash
                commit('setToken',token)

                resolve(token)
            }catch(err){
                reject(err)
            }
            finally{
                delete promises[hash]
            }
        })
    }

}
