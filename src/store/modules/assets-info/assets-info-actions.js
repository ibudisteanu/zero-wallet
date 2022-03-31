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

    async getAssetsInfo( {state, dispatch, commit}, { start, end, view } ){

        if (!state.allowDownload) return

        start = Decimal.max(0, start)

        if (view === true ) {
            const viewStart = Decimal.ceil( end.div( consts.assetsInfoPagination )).minus(1).mul( consts.assetsInfoPagination )
            const viewEnd = viewStart.plus( consts.assetsInfoPagination )
            commit('setBlocksInfoViewPosition', {starting: start, end: viewEnd})
        } else if (view === false )
            commit('setBlocksInfoViewPosition', null )

        console.log("start, end", start.toString(), end.toString() )

        const newAssetsInfo = {}

        for (let i = end.minus(1); i.gte(start); i = i.minus(1))
            if ( !state.listByHeight[i])
                newAssetsInfo[i] = await this.dispatch('getAssetInfoByHeight', i)

        commit('setAssetsInfo', {newAssetsInfo, start, end} )
    },

}
