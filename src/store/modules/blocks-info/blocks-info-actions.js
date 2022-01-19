import consts from "consts/consts";

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

        starting = Math.max(0, starting )
        const ending = Math.min( starting + consts.blocksInfoPagination -1, blockchainEnd-1 )

        if (view === true ) {
            const viewStart = (Math.ceil( ending / consts.blocksInfoPagination )-1) * consts.blocksInfoPagination
            const viewEnd = viewStart + consts.blocksInfoPagination
            commit('setBlocksInfoViewPosition', {starting: viewStart, ending: viewEnd})
        } else if (view === false ) {
            commit('setBlocksInfoViewPosition', null )
        }

        console.log("starting, ending", starting, ending)

        const listByHeight = {
            ...state.listByHeight,
        }

        let found = false
        for (let i = ending; i >= starting ; i-- ){

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

        const viewPosition = state.viewPosition
        if (viewPosition){
            let c = 0
            for (const heightStr in listByHeight){
                const height = Number.parseInt(heightStr)
                if ( !( height > viewPosition.ending || height < viewPosition.starting ) )
                    c++
            }

            if (c >= consts.blocksInfoPagination)
                for (const heightStr in listByHeight){
                    const height = Number.parseInt(heightStr)
                    if ( height > viewPosition.ending || height < viewPosition.starting )
                        delete(listByHeight[height])
                }
        } else {
            for (const heightStr in listByHeight){
                const height = Number.parseInt(heightStr)
                if ( height > ending || height < starting )
                    delete(listByHeight[height])
            }
        }

        commit('setBlocksInfo', listByHeight )
    },

}
