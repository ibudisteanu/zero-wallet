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

    async includeTx( {state, dispatch, commit, getters}, txJSON ){

        const tx = txJSON.tx

        if (txJSON.info) {
            tx.__height = txJSON.info.height
            tx.__blkHeight = txJSON.info.blkHeight
            tx.__timestamp = txJSON.info.timestamp
        } else {
            tx.__mempool = txJSON.mempool
        }

        if (tx.dataVersion === PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_NONE ){
        } else if (tx.dataVersion === PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_PLAIN_TEXT ){
            tx.__data = Buffer.from(tx.data, "hex").toString()
        } else if (tx.dataVersion === PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_ENCRYPTED ){

            tx.__data = tx.data
            await dispatch('decryptTxData', { tx, commitNow: false })

        }

        for (const vin of tx.vin) await dispatch('getTokenByHash', vin.token)
        for (const vout of tx.vout) await dispatch('getTokenByHash', vout.token)

        commit("setTransactions", { txs: [tx] } )

        return tx
    },

    async decryptTxData( {state, dispatch, commit, getters}, {tx, hash, password = "", commitNow } ){

        if (!tx) tx = state.txsByHash[hash]

        let decrypted = false

        for (const vout of tx.vout){

            const walletAddress = getters.walletContains( vout.publicKey )
            if ( walletAddress ){
                tx.__dataCanBeDecrypted = true

                try{

                    if ( password || !getters.isWalletEncrypted() ) {
                        const data = await PandoraPay.wallet.decryptMessageWalletAddress(tx.data, walletAddress.addressEncoded, password)
                        tx.__dataDecrypted = Buffer.from(data, "hex").toString()
                        tx.__dataDecryptedError = ""
                        decrypted = true
                        break
                    }

                    if ( !password && getters.isWalletEncrypted() ) {
                        decrypted = true
                        break
                    }


                }catch(err){
                    tx.__dataDecrypted = ""
                    tx.__dataDecryptedError = err.toString()
                    decrypted = true
                    break
                }

            }
        }

        if (!decrypted){
            tx.__dataDecrypted = ""
            tx.__dataDecryptedError = "Data can't be decrypted"
        }

        if (commitNow)
            commit("setTransactions", { txs: [tx] } )

    },

    async getTransactionByHash( {state, dispatch, commit}, hash){

        if (state.txsByHash[hash]) return state.txsByHash[hash];
        if (promises.txsByHash[hash]) return promises.txsByHash[hash];

        return promises.txsByHash[hash] = new Promise( async (resolve, reject ) => {

            try{

                const txData = await PandoraPay.network.getNetworkTransaction( hash );

                if (!txData) throw Error("tx fetch failed"); //disconnected

                const tx = JSON.parse(txData)

                const output = await dispatch('includeTx', tx)

                resolve( output );
            }catch(err){
                reject(err);
            } finally{
                delete promises.txsByHash[hash];
            }
        } );
    },

    getTransactionByHeight( {state, dispatch, commit}, height){

        if (typeof height === "string") height = Number.parseInt(height)

        if (state.txsByHeight[height]) return state.txsByHeight[height];
        if (promises.txsByHeight[height]) return promises.txsByHeight[height];

        return promises.txsByHeight[height] = new Promise( async (resolve, reject ) => {

            try{

                const txData = await PandoraPay.network.getNetworkTransaction( height );
                if (!txData) throw Error("tx fetch failed"); //disconnected

                const tx = JSON.parse(txData)

                resolve( await dispatch('includeTx', tx) );

            }catch(err){
                reject(err);
            } finally{
                delete promises.txsByHeight[height];
            }
        } );

    },

    txNotification({state, commit}, {txHash, extraInfo }) {
        commit('updateTxNotification', {txHash, extraInfo})
    }

}
