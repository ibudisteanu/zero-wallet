const promises = {
    blocksByHeight: {},
    blocksByHash: {},
}

export default {

    async _includeBlock({state, dispatch, commit}, blk){

        const txs = [];
        for (const tx of blk.txs) {

            tx.__height = ""
            tx.__blkHeight = blk.height
            tx.__timestamp = blk.timestamp

            await dispatch('processTx', tx)

            txs.push(tx)
        }

        commit('setTransactions', { txs } )
        commit('setBlock', {block: blk} )

        return blk;
    },

    getBlockByHash({state, dispatch, commit}, hash){

        if (state.blocksByHash[hash]) return state.blocksByHash[hash];
        if (promises.blocksByHash[hash]) return promises.blocksByHash[hash];

        return promises.blocksByHash[hash] = new Promise( async (resolve, reject) => {
            try{

                const data = await PandoraPay.network.getNetworkBlockComplete( hash );
                if (!data) throw "Block was not received"

                const blk = JSON.parse(MyTextDecode(data))
                if (blk.bloom.hash !== hash) throw "Block hash was not matching"

                const out = await dispatch('_includeBlock', blk )
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

                const data = await PandoraPay.network.getNetworkBlockComplete( height );
                if (!data) throw "Block was not received"

                const blk = JSON.parse(MyTextDecode(data))
                if (blk.height !== height) throw "Block height was not matching"

                resolve( await dispatch('_includeBlock', blk ) );

            }catch(err){
                reject(err);
            }finally{
                delete promises.blocksByHeight[height];
            }
        });

    },

}
