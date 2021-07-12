import consts from "consts/consts";

const promises = {}

export default {

    async _getBlockInfo( {state, dispatch, commit}, height ){

        if (promises[height]) return promises[height];

        return promises[height] = new Promise( async (resolve, reject) => {

            try{
                const blockInfoData = await PandoraPay.network.getNetworkBlockInfo( height );
                const blockInfo = JSON.parse(blockInfoData)

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

    async getBlocksInfo( {state, dispatch, commit}, { starting, blockchainEnd, view = false} ){

        starting = Math.max(0, starting )
        const ending = Math.min( starting + consts.blocksInfoPagination -1, blockchainEnd-1 )

        if (view)
            commit('setBlocksInfoViewPosition', {starting, ending} )

        const newBlocksInfo = {}

        let found = false
        for (let i = ending; i >= starting ; i-- ){

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

        const deletedBlocksInfo = []
        for (const key in state.listByHeight){
            const height = Number.parseInt(key)
            if ( (height < starting || height > ending) && ( state.viewPosition && ( height > state.viewPosition.ending || height < state.viewPosition.starting) ) )
                deletedBlocksInfo.push(key)
        }
        commit('setBlocksInfo', {newBlocksInfo, deletedBlocksInfo })

    },

}
