import consts from "../../../../consts/consts";

const promises = {}

export default {

    async getAssetInfoByHeight( {state, dispatch, commit}, height ){

        if (promises[height]) return promises[height];

        return promises[height] = new Promise( async (resolve, reject) => {

            try{
                const assetInfoData = await PandoraPay.network.getNetworkAssetInfo( height, "" );
                if (!assetInfoData) throw "Error getting blockData"

                const assetInfo = JSON.parse( MyTextDecode( assetInfoData ) )

                if (!assetInfo || !assetInfo.hash)
                    throw "Error getting block info"

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
                if (!assetInfoData ) throw "Error getting block info"

                const assetInfo = JSON.parse(MyTextDecode(assetInfoData))

                if (assetInfo.name === "PANDORA") assetInfo.name = "0x00"

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

    async getAssetsInfo( {state, dispatch, commit}, { starting, assetsCount} ){

        starting = Math.max(0, starting )
        const ending = Math.min( starting + consts.assetsInfoPagination -1, assetsCount-1 )

        const listByHeight = {
            ...state.listByHeight,
        }

        let found = false
        for (let i = ending; i >= starting ; i-- ){

            let beforeHash
            if (listByHeight[i] && listByHeight[i].hash )
                beforeHash = listByHeight[i].hash

            if (!found || !listByHeight[i]) {

                let assetInfo = await this.dispatch('getAssetInfoByHeight', i)
                listByHeight[i] = assetInfo

                if (!found && beforeHash === assetInfo.hash )
                    found = true
            }

        }

        commit('setAssetsInfo', listByHeight )
    },

}
