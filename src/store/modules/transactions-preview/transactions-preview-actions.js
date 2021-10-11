const promises = {
    txsByHeight: {},
    txsByHash: {},
}

export default {

    async includeTxPreview( {state, dispatch, commit, getters}, {txPreview, info} ){
        const tx = txPreview

        if (info) tx.__height = info.height
        else {
            delete tx.__height
            info = {mempool: true}
        }
        dispatch('storeTransactionInfo', { hash: tx.hash, txInfo:  info  })

        if (tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE)
            await dispatch('getAssetByHash', PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX )

        if (tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER)
            await Promise.all( tx.base.payloads.map( payload => dispatch('getAssetByHash', payload.asset ) ) )

        commit("setTransactionsPreview", { txs: [tx] } )

        return tx
    },

    getTransactionPreviewByHash( {state, dispatch, commit}, hash){
        if (state.txsByHash[hash]) return state.txsByHash[hash];
        if (promises.txsByHash[hash]) return promises.txsByHash[hash];
        return promises.txsByHash[hash] = new Promise( async (resolve, reject ) => {
            try{
                const data = await PandoraPay.network.getNetworkTxPreview( "0", hash );
                if (!data) throw "tx fetch failed"; //disconnected
                resolve( await dispatch('includeTxPreview', JSON.parse(MyTextDecode(data)) ) );
            }catch(err){
                reject(err);
            } finally{
                delete promises.txsByHash[hash];
            }
        } );
    },

    async getTransactionPreviewByHeight( {state, dispatch, commit}, height){
        if (typeof height === "string") height = Number.parseInt(height)

        if (state.txsByHeight[height]) return state.txsByHeight[height];
        if (promises.txsByHeight[height]) return promises.txsByHeight[height];
        return promises.txsByHeight[height] = new Promise( async (resolve, reject ) => {
            try{
                const data = await PandoraPay.network.getNetworkTxPreview( height.toString(), "" );
                if (!data) throw "tx fetch failed"; //disconnected
                resolve( await dispatch('includeTxPreview', JSON.parse(MyTextDecode(data)) ) );
            }catch(err){
                reject(err);
            } finally{
                delete promises.txsByHeight[height];
            }
        } );
    },

    txPreviewNotification({state, dispatch, commit}, { txHash, extraInfo }) {
        commit('updateTxPreviewNotification', { txHash, extraInfo })
    }

}