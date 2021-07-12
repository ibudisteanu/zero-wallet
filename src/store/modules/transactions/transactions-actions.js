const promises = {}

export default {

    async _includeTx( {state, dispatch, commit}, txJSON ){

        const tx = txJSON.tx

        tx.__extra = {
            mempool: txJSON.mempool,
        };

        if (txJSON.info) {
            tx.__extra.height = txJSON.info.height
            tx.__extra.blkHeight = txJSON.info.blkHeight
            tx.__extra.timestamp = txJSON.info.timestamp
        }

        for (const vin of tx.base.vin) await dispatch('getTokenInfoByHash', vin.token)
        for (const vout of tx.base.vout) await dispatch('getTokenInfoByHash', vout.token)

        commit("setTransactions", [tx] )

        return tx
    },

    async getTransactionByHash( {state, dispatch, commit}, hash){

        if (state.txsByHash[hash]) return state.txsByHash[hash];
        if (promises[hash]) return promises[hash];

        return promises[hash] = new Promise( async (resolve, reject ) => {

            try{

                const txData = await PandoraPay.network.getNetworkTransaction( hash );
                if (!txData) throw Error("tx fetch failed"); //disconnected

                const tx = JSON.parse(txData)

                resolve( await dispatch('_includeTx', tx) );
            }catch(err){
                reject(err);
            } finally{
                delete promises[hash];
            }
        } );
    },

    getTransactionByHeight( {state, dispatch, commit}, height){

        if (typeof height === "string") height = Number.parseInt(height)

        if (state.txsByHeight[height]) return state.txsByHeight[height];
        if (promises[height]) return promises[height];

        return promises[height] = new Promise( async (resolve, reject ) => {

            try{

                const txData = await PandoraPay.network.getNetworkTransaction( height );
                if (!txData) throw Error("tx fetch failed"); //disconnected

                const tx = JSON.parse(txData)

                resolve( await dispatch('_includeTx', tx) );

            }catch(err){
                reject(err);
            } finally{
                delete promises[height];
            }
        } );

    },

}
