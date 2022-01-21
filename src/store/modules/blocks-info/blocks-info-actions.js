import consts from "consts/consts";
import Decimal from 'decimal.js';

const promises = {}

export default {

    async _getBlockInfo( {state, dispatch, commit}, height ){

        if (promises[height]) return promises[height];

        return promises[height] = new Promise( async (resolve, reject) => {

            try{
                const blockInfoData = await PandoraPay.network.getNetworkBlockInfo( Number.parseInt(height), "" );
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

    async getBlocksInfo( {state, dispatch, commit}, { starting, blockchainEnd, view = null} ){

        if (!state.allowDownload) return

        starting = Decimal.max(0, starting )
        const ending = Decimal.min( starting.plus( consts.blocksInfoPagination).minus(1), blockchainEnd.minus(1) )

        if (view === true ) {
            const viewStart = Decimal.ceil( ending.div( consts.blocksInfoPagination )).minus(1).mul( consts.blocksInfoPagination )
            const viewEnd = viewStart.plus( consts.blocksInfoPagination )
            commit('setBlocksInfoViewPosition', {starting: viewStart, ending: viewEnd})
        } else if (view === false ) {
            commit('setBlocksInfoViewPosition', null )
        }

        console.log("starting, ending", starting.toString(), ending.toString() )

        let listByHeight = {
            ...state.listByHeight,
        }

        let found = false
        for (let i = ending; i.gte(starting); i = i.minus(1)){
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

        const viewPosition = state.viewPosition
        if (viewPosition){
            let c = 0
            for (const heightStr in listByHeight){
                const height = new Decimal(heightStr)
                if ( !( height.gt( viewPosition.ending ) || height.lt( viewPosition.starting ) ) )
                    c++
            }

            if (c >= consts.blocksInfoPagination)
                for (const heightStr in listByHeight){
                    const height = new Decimal(heightStr)
                    if ( height.gt( viewPosition.ending ) || height.lt( viewPosition.starting ) )
                        delete(listByHeight[height])
                }
        } else
            for (const heightStr in listByHeight){
                const height = new Decimal(heightStr)
                if ( height.gt( ending ) || height.lt( starting) )
                    delete(listByHeight[height])
            }

        commit('setBlocksInfo', listByHeight )
    },

}
