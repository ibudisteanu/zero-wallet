import consts from "consts/consts";
import Decimal from "decimal.js"

const promises = {}

export default {

    async getAssetInfoByHeight( {state, dispatch, commit}, height ){

        if (promises[height]) return promises[height];

        return promises[height] = new Promise( async (resolve, reject) => {

            try{
                const assetInfoData = await PandoraPay.network.getNetworkAssetInfo( MyTextEncode(JSONStringify({height, hash: ""}) ));
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

                const assetInfoData = await PandoraPay.network.getNetworkAssetInfo( MyTextEncode(JSONStringify({height:0, hash}) ));
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

        start = Decimal.min(start, count.minus(1) )
        end = Decimal.min( start.plus( consts.assetsInfoPagination ), count.minus(1) )

        const listByHeight = { }

        for (let i = end; i.gte(start);  i = i.minus(1) )
            listByHeight[i] = await this.dispatch('getAssetInfoByHeight', i)

        commit('setAssetsInfo', listByHeight )
    },

}
