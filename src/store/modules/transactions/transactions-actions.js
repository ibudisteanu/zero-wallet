const promises = {
    txsByHeight: {},
    txsByHash: {},
    unsubscribed: {},
    subscribed: {},
}

export default {

    async subscribeTransaction( {state, dispatch, commit}, txId ){

        if (state.subscribed[txId]) return true

        if (promises.subscribed[txId]) return promises.subscribed[txId];
        return promises.subscribed[txId] = new Promise( async (resolve, reject) => {
            try{

                await PandoraPay.network.subscribeNetwork( txId, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_TRANSACTION )

                commit('setSubscribedTxStatus', {txId, status: true})

                resolve(true)
            }catch(err){
                reject(err)
            }finally{
                delete promises.subscribed[txId]
            }
        })
    },

    async unsubscribeTransaction( {state, dispatch, commit}, txId ){

        if (!state.subscribed[txId]) return true

        if (promises.unsubscribed[txId]) return promises.unsubscribed[txId];
        return promises.unsubscribed[txId] = new Promise( async (resolve, reject) => {
            try{

                await PandoraPay.network.unsubscribeNetwork( txId, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_TRANSACTION )

                commit('setSubscribedTxStatus', {txId, status: false})

                resolve(true)
            }catch(err){
                reject(err)
            }finally{
                delete promises.unsubscribed[txId]
            }
        })
    },

    async includeTx( {state, dispatch, commit, getters}, {tx, info, mempool} ){

        if (info) tx.__height = info.height
        else {
            delete tx.__height
            info = {mempool: mempool}
        }
        dispatch('storeTransactionInfo', { hash: tx.hash, txInfo:  info  })

        if (tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE)
            await dispatch('getAssetByHash', PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX )

        if (tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER)
            await Promise.all( tx.payloads.map( payload => dispatch('getAssetByHash', payload.asset ) ) )

        commit("setTransactions", { txs: [tx] } )

        return tx
    },

    getTransactionByHash( {state, dispatch, commit}, hash){
        if (state.txsByHash[hash]) return state.txsByHash[hash];
        if (promises.txsByHash[hash]) return promises.txsByHash[hash];
        return promises.txsByHash[hash] = new Promise( async (resolve, reject ) => {
            try{
                const data = await PandoraPay.network.getNetworkTx( 0, hash );
                if (!data) throw "tx fetch failed"; //disconnected
                resolve( await dispatch('includeTx', JSON.parse(MyTextDecode(data)) ) );
            }catch(err){
                reject(err);
            } finally{
                delete promises.txsByHash[hash];
            }
        } );
    },

    async getTransactionByHeight( {state, dispatch, commit}, height){
        if (typeof height === "string") height = Number.parseInt(height)

        if (state.txsByHeight[height]) return state.txsByHeight[height];
        if (promises.txsByHeight[height]) return promises.txsByHeight[height];
        return promises.txsByHeight[height] = new Promise( async (resolve, reject ) => {
            try{
                const data = await PandoraPay.network.getNetworkTx( height, "" );
                if (!data) throw "tx fetch failed"; //disconnected
                resolve( await dispatch('includeTx', JSON.parse(MyTextDecode(data)) ) );
            }catch(err){
                reject(err);
            } finally{
                delete promises.txsByHeight[height];
            }
        } );

    },

    txNotification({state, dispatch, commit}, { txHash, extraInfo }) {
        dispatch('txPreviewNotification', { txHash, extraInfo } )
        dispatch('txInfoNotification', { txHash, extraInfo } )
        commit('updateTxNotification', { txHash, extraInfo })
    }

}
