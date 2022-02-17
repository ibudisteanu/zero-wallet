const promises = {
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

        if (tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE ))
            await dispatch('getAssetByHash', PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64 )

        if (tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER) )
            await Promise.all( tx.base.payloads.map( payload => dispatch('getAssetByHash', payload.asset ) ) )

        commit("setTransactionsPreview", { txs: [tx] } )

        return tx
    },

    getTransactionPreviewByHash( {state, dispatch, commit}, hash){
        if (state.txsByHash[hash]) return state.txsByHash[hash];
        if (promises.txsByHash[hash]) return promises.txsByHash[hash];
        return promises.txsByHash[hash] = new Promise( async (resolve, reject ) => {
            try{
                const data = await PandoraPay.network.getNetworkTxPreview( MyTextEncode(JSONStringify({height:0, hash}) ) );
                if (!data) throw "tx fetch failed"; //disconnected
                resolve( await dispatch('includeTxPreview', JSONParse(MyTextDecode(data)) ) );
            }catch(err){
                reject(err);
            } finally{
                delete promises.txsByHash[hash];
            }
        } );
    },

    txPreviewNotification({state, dispatch, commit}, { txHash, extraInfo }) {
        commit('updateTxPreviewNotification', { txHash, extraInfo })
    }

}