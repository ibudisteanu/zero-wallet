export default {

    async processAccountPendingTransactions({dispatch, state, getters, commit }, { publicKeyHash, list }){

        if (!list) list = []

        if (list.length && getters.walletContains(publicKeyHash)) {
            const txs = await Promise.all( list.map( txHash => dispatch('getTransactionByHash', txHash ) ))

            txs.sort( (a,b) => ( (a.version === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ? a.nonce : -1) -
                    ( (b.version === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ? b.nonce : -1 ) )

            await Promise.all(txs.map( tx => ()=>{
                try{
                    PandoraPay.mempool.mempoolInsertTx( tx.hash, JSON.stringify(tx))
                }catch(err){

                }
            } ))
        }

        const map = {}
        list.map( it => map[it] = true )

        commit('setPendingList', { publicKeyHash, map })

    },

    async accountPendingTransactionsTxUpdateNotification({dispatch, state, getters, commit}, {publicKeyHash, txHash, extraInfo }){

        if (extraInfo.blockchain){

            commit('updatePendingList', {publicKeyHash, txHash, inserted: false})

            if (extraInfo.blockchain.inserted){
                await PandoraPay.mempool.mempoolRemoveTx(txHash)
            }

        } else if (extraInfo.mempool) {

            if (extraInfo.mempool.inserted){

                const tx = await dispatch('getTransactionByHash', txHash )

                try{
                    await PandoraPay.mempool.mempoolInsertTx( txHash, JSON.stringify(tx) )
                }catch(err){

                }

                commit('updatePendingList', {publicKeyHash, txHash, inserted: true })

            }else {

                await PandoraPay.mempool.mempoolRemoveTx(txHash)
                commit('updatePendingList', {publicKeyHash, txHash, inserted: false })

            }

        } else throw "Invalid extraInfo"

    }

}