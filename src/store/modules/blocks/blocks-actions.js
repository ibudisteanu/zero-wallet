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

            await dispatch('getTokenByHash', tx.token)

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

                const blockData = await PandoraPay.network.getNetworkBlockComplete( hash );
                if (!blockData) throw Error("Block was not received")

                const blk = JSON.parse(blockData)
                if (blk.bloom.hash !== hash) throw Error("Block hash was not matching")

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

                const blockData = await PandoraPay.network.getNetworkBlockComplete( height );
                if (!blockData) throw Error("Block was not received")

                const blk = JSON.parse(blockData)
                if (blk.height !== height) throw Error("Block height was not matching")

                resolve( await dispatch('_includeBlock', blk ) );

            }catch(err){
                reject(err);
            }finally{
                delete promises.blocksByHeight[height];
            }
        });

    },

}
