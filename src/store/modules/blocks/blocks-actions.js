const promises = {
    blocksByHeight: {},
    blocksByHash: {},
}

export default {

    _includeBlock({state, dispatch, commit}, blk){
        commit('setBlock', {block: blk} )
        return blk;
    },

    getBlockByHash({state, dispatch, commit}, hash){

        if (state.blocksByHash[hash]) return state.blocksByHash[hash];
        if (promises.blocksByHash[hash]) return promises.blocksByHash[hash];

        return promises.blocksByHash[hash] = new Promise( async (resolve, reject) => {
            try{

                const data = await PandoraPay.network.getNetworkBlockWithTxs( MyTextEncode( JSONStringify({height: 0, hash} ) ) );
                if (!data) throw "Block was not received"

                const {block, txs} = JSONParse(MyTextDecode(data))
                block.txs = txs || []

                resolve( dispatch('_includeBlock', block ) );

            }catch(err){
                reject(err);
            }finally{
                delete promises.blocksByHash[hash];
            }
        })
    },

    getBlockByHeight( {state, dispatch, commit}, height ){

        if (state.blocksByHeight[height]) return state.blocksByHeight[height];
        if (promises.blocksByHeight[height]) return promises.blocksByHeight[height];

        return promises.blocksByHeight[height] = new Promise( async (resolve, reject) => {

            try{

                const data = await PandoraPay.network.getNetworkBlockWithTxs( MyTextEncode( JSONStringify({height, hash: ""} ) ));
                if (!data) throw "Block was not received"

                const {block, txs} = JSONParse(MyTextDecode(data))
                block.txs = txs || []
                if (!block.height.eq(height)) throw "Block height was not matching"

                resolve( dispatch('_includeBlock', block ) );

            }catch(err){
                reject(err);
            }finally{
                delete promises.blocksByHeight[height];
            }
        });

    },

}
