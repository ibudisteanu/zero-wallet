import consts from "consts/consts";
import Decimal from 'decimal.js';

const promises = {}

export default {

    async _getBlockInfo( {state, dispatch, commit}, height ){

        if (promises[height]) return promises[height];

        return promises[height] = new Promise( async (resolve, reject) => {

            try{
                const blockInfoData = await PandoraPay.network.getNetworkBlockInfo( MyTextEncode(JSONStringify({height, hash: ""}) ) );
                if (!blockInfoData) throw "Error getting blockData"

                const blockInfo = JSONParse( MyTextDecode( blockInfoData ) )

                if (!blockInfo || !blockInfo.hash)
                    throw "Error getting block info"

                blockInfo.height = height
                resolve(blockInfo)

            }catch(err){
                reject(err)
            }finally {
                delete promises[height]
            }

        })

    },

    async getBlocksInfo( {state, dispatch, commit}, { start, end, view} ){

        if (!state.allowDownload) return

        start = Decimal.max(0, start)

        if (view === true ) {
            const viewStart = Decimal.ceil( end.div( consts.blocksInfoPagination )).minus(1).mul( consts.blocksInfoPagination )
            const viewEnd = viewStart.plus( consts.blocksInfoPagination )
            commit('setBlocksInfoViewPosition', {start: start, end: viewEnd})
        } else if (view === false )
            commit('setBlocksInfoViewPosition', null )

        console.log("start, end", start.toString(), end.toString() )

        const newBlocksInfo = {}

        let found = false
        for (let i = end.minus(1); i.gte(start); i = i.minus(1)){

            let beforeHash
            if (state.listByHeight[i] && state.listByHeight[i].hash )
                beforeHash = state.listByHeight[i].hash

            if (!found || !state.listByHeight[i]) {

                let blockInfo = await this.dispatch('_getBlockInfo', i)
                newBlocksInfo[i] = blockInfo

                if (!found && beforeHash === blockInfo.hash )
                    found = true

            }
        }

        commit('setBlocksInfo', {newBlocksInfo, start, end} )
    },

}
