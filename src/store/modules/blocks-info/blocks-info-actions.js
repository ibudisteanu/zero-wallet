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
            commit('setBlocksInfoViewPosition', {starting: start, end: viewEnd})
        } else if (view === false )
            commit('setBlocksInfoViewPosition', null )

        console.log("start, end", start.toString(), end.toString() )

        let listByHeight = {
            ...state.listByHeight,
        }

        let found = false
        for (let i = end.minus(1); i.gte(start); i = i.minus(1)){

            let beforeHash
            if (listByHeight[i] && listByHeight[i].hash )
                beforeHash = listByHeight[i].hash

            if (!found || !listByHeight[i]) {

                let blockInfo = await this.dispatch('_getBlockInfo', i)
                listByHeight[i] = blockInfo

                if (!found && beforeHash === blockInfo.hash )
                    found = true

            }
        }

        listByHeight = {
            ...state.listByHeight,
            ...listByHeight,
        }

        let viewPosition = {start, end}
        if (state.viewPosition)
            viewPosition = state.viewPosition

        for (const heightStr in listByHeight){
            const height = new Decimal(heightStr)
            if ( height.gt( viewPosition.end ) || height.lt( viewPosition.start.minus(consts.blocksInfoPagination) ) )
                delete(listByHeight[height])
        }

        commit('setBlocksInfo', listByHeight )
    },

}
