const promises = {}

export default {

    async getAssetInfoByHash( {state, dispatch, commit}, hash){

        if (!hash.length) hash = PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX

        if (state.list[hash]) return state.list[hash]
        if (promises[hash]) return promises[hash];
        return state[hash] = new Promise( async (resolve, reject) => {
            try{

                const assetInfoData = await PandoraPay.network.getNetworkAssetInfo(hash);
                if (!assetInfoData ) throw "Error getting block info"

                const assetInfo = JSON.parse(MyTextDecode(assetInfoData))

                assetInfo.name = "$0x00"

                assetInfo.hash = hash
                commit('setAssetInfo', assetInfo)

                resolve(assetInfo)
            }catch(err){
                reject(err)
            }
            finally{
                delete promises[hash]
            }
        })
    }

}
