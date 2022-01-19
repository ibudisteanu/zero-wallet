import consts from "consts/consts";

const promises = {}

export default {

    async getAssetInfoByHeight( {state, dispatch, commit}, height ){

        if (promises[height]) return promises[height];

        return promises[height] = new Promise( async (resolve, reject) => {

            try{
                const assetInfoData = await PandoraPay.network.getNetworkAssetInfo( height, "" );
                if (!assetInfoData) throw "Error getting assetInfo"

                const assetInfo = JSONParse( MyTextDecode( assetInfoData ) )
                if (!assetInfo ) throw "Error getting asset info"

                assetInfo.height = height
                resolve(assetInfo)

            }catch(err){
                reject(err)
            }finally {
                delete promises[height]
            }

        })

    },

    async getAssetInfoByHash( {state, dispatch, commit}, hash){

        if (state.list[hash]) return state.list[hash]
        if (promises[hash]) return promises[hash];
        return state[hash] = new Promise( async (resolve, reject) => {
            try{

                const assetInfoData = await PandoraPay.network.getNetworkAssetInfo(0, hash);
                if (!assetInfoData ) throw "Error getting asset info"

                const assetInfo = JSONParse(MyTextDecode(assetInfoData))

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

    },

    async getAssetsInfo( {state, dispatch, commit}, { start, end, count } ){

        start = Math.min(start, count-1 )
        end = Math.min( start + consts.assetsInfoPagination, count-1 )

        const listByHeight = { }

        for (let i = end; i >= start ; i-- )
            listByHeight[i] = await this.dispatch('getAssetInfoByHeight', i)

        commit('setAssetsInfo', listByHeight )
    },

}
