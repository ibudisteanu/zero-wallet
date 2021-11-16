const promises = {
    blocksByHeight: {},
    blocksByHash: {},
}

export default {

    async _includeBlock({state, dispatch, commit}, blk){
        commit('setBlock', {block: blk} )
        return blk;
    },

    getBlockByHash({state, dispatch, commit}, hash){

        if (state.blocksByHash[hash]) return state.blocksByHash[hash];
        if (promises.blocksByHash[hash]) return promises.blocksByHash[hash];

        return promises.blocksByHash[hash] = new Promise( async (resolve, reject) => {
            try{

                const data = await PandoraPay.network.getNetworkBlockWithTxs( 0, hash );
                if (!data) throw "Block was not received"

                const {block, txs} = JSON.parse(MyTextDecode(data))
                block.txs = txs || []
                if (block.bloom.hash !== hash) throw "Block hash was not matching"

                const out = await dispatch('_includeBlock', block )
                resolve( out );

            }catch(err){
                reject(err);
            }finally{
                delete promises.blocksByHash[hash];
            }
        })
    },

    getBlockByHeight( {state, dispatch, commit}, height ){

        if (typeof height === "string") height = Number.parseInt(height)

        if (state.blocksByHeight[height]) return state.blocksByHeight[height];
        if (promises.blocksByHeight[height]) return promises.blocksByHeight[height];

        return promises.blocksByHeight[height] = new Promise( async (resolve, reject) => {

            try{

                const data = await PandoraPay.network.getNetworkBlockWithTxs( Number.parseInt(height), "" );
                if (!data) throw "Block was not received"

                const {block, txs} = JSON.parse(MyTextDecode(data))
                block.txs = txs || []
                if (block.height !== height) throw "Block height was not matching"

                resolve( await dispatch('_includeBlock', block ) );

            }catch(err){
                reject(err);
            }finally{
                delete promises.blocksByHeight[height];
            }
        });

    },

}
