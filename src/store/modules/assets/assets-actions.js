const promises = {}

export default {

    async getAssetByHash( {state, dispatch, commit}, hash){

        if (state.list[hash]) return state.list[hash]
        if (promises[hash]) return promises[hash];
        return promises[hash] = new Promise( async (resolve, reject) => {
            try{
                const assetData = await PandoraPay.network.getNetworkAsset(hash);
                if (!assetData ) throw "Error getting block info"

                const asset = JSON.parse(MyTextDecode(assetData) )

                asset.hash = hash

                await PandoraPay.store.storeAsset( hash, assetData  )

                asset.name = "$0x00"

                commit('setAsset',asset)

                resolve(asset)
            }catch(err){
                reject(err)
            } finally{
                delete promises[hash]
            }
        })
    }

}
