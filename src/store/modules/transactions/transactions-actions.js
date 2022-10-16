const promises = {
    txsByHeight: {},
    txsByHash: {},
    unsubscribed: {},
    subscribed: {},
}

export default {

    async subscribeTransaction( {state, dispatch, commit}, {txId, forced} ){

        if (!forced && state.subscribed[txId]) return true

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

        if (!txId) return
        if ( !state.subscribed[txId]) return true

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

    async resubscribeTransactions({state, dispatch, commit} ){

        const promises = []
        for (const txId in state.subscribed)
            promises.push( dispatch('subscribeTransaction', {txId, forced: true }) )

        return Promise.all(promises)
    },

    async includeTx( {state, dispatch, commit, getters}, {tx, serialized, info, mempool} ){

        tx._serialized = serialized

        if (info) tx.__height = info.height
        else {
            delete tx.__height
            info = {mempool: mempool}
        }
        dispatch('storeTransactionInfo', { hash: tx.hash, txInfo:  info  })

        if (tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE ))
            await dispatch('getAssetByHash', PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64 )

        if (tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER) )
            await Promise.all( tx.payloads.map( payload => dispatch('getAssetByHash', payload.asset ) ) )

        commit("setTransactions", { txs: [tx] } )

        return tx
    },

    getTransactionByHash( {state, dispatch, commit}, hash){
        if (state.txsByHash[hash]) return state.txsByHash[hash];
        if (promises.txsByHash[hash]) return promises.txsByHash[hash];
        return promises.txsByHash[hash] = new Promise( async (resolve, reject ) => {
            try{
                const data = await PandoraPay.network.getNetworkTx( MyTextEncode( JSONStringify({height: 0, hash})) );
                if (!data) throw "tx fetch failed"; //disconnected
                resolve( await dispatch('includeTx', JSONParse(MyTextDecode(data)) ) );
            }catch(err){
                reject(err);
            } finally{
                delete promises.txsByHash[hash];
            }
        } );
    },

    async decryptTx({state, dispatch, commit}, {hash, publicKey}){
        try{

            const tx = await dispatch('getTransactionByHash', hash)
            if (!tx) throw "Transaction was not found on the blockchain. Maybe it was deleted meanwhile."

            const output = await PandoraPay.wallet.decryptTx( Buffer.from(tx._serialized, "base64"), publicKey )
            if (!output) return "Error reading decrypted data"

            const decrypted = JSONParse( MyTextDecode( output ) )

            if (decrypted.zetherTx){

                decrypted.zetherTx.payloads.forEach((payload, index)=>{
                    if (payload !== null ){
                        if (!payload.recipientIndex.eq(-1) )
                            payload.recipientPublicKey = tx.payloads[index].statement.publickeylist[payload.recipientIndex]
                        delete payload.blinder
                    }
                })

                localStorage.setItem(`txDecrypted:${hash}:${publicKey}`, JSONStringify(decrypted))

                return decrypted
            }

        }catch(err){
            dispatch('addToast', {
                type: 'success',
                title: `Error decrypting TX!`,
                text: `Reason ${err.toString()}`,
            });
        }
    },

    async getTransactionByHeight( {state, dispatch, commit}, height){

        if (state.txsByHeight[height]) return state.txsByHeight[height];
        if (promises.txsByHeight[height]) return promises.txsByHeight[height];
        return promises.txsByHeight[height] = new Promise( async (resolve, reject ) => {
            try{
                const data = await PandoraPay.network.getNetworkTx( MyTextEncode(JSONStringify({height, hash:""}) ));
                if (!data) throw "tx fetch failed"; //disconnected
                resolve( await dispatch('includeTx', JSONParse(MyTextDecode(data)) ) );
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
