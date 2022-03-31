export default {

    setSubscribedTxPreviewStatus(state, {txId, status}) {
        if (status) state.subscribed[txId] = true
        else delete state.subscribed[txId]
    },

    deleteTransactionsPreview(state, transactions) {
        for (const tx of transactions)
            delete state.txsByHash[tx.hash]
    },

    setTransactionsPreview( state, {txs, overwrite = true } ) {
        const timestamp = new Date().getTime()

        for (const tx of txs){
            tx.__timestampUsed = timestamp
            if (overwrite || !state.txsByHash[tx.hash] )
                state.txsByHash[tx.hash] = tx
        }

    },

    updateViewTransactionsPreviewHashes(state, {txsHashes, insert} ) {
        if (!txsHashes || !txsHashes.length) return

        for (const txHash of txsHashes ){
            if (insert) state.viewTxsHashes[txHash] = true
            else delete state.viewTxsHashes[txHash]
        }

    },

    updateTxPreviewNotification(state, {txHash, extraInfo }) {

        if (!state.txsByHash[txHash]) return

        const tx = state.txsByHash[txHash]

        if (extraInfo.blockchain) {
            if (extraInfo.blockchain.inserted) tx.__height = extraInfo.blockchain.height
            else delete tx.__height
        } else if (extraInfo.mempool){
            if (extraInfo.mempool.inserted) {
                delete tx.__height
                tx.mempool = true
            }
            else {
                if (!extraInfo.mempool.included){
                    delete tx.__height
                }
                delete tx.mempool
            }
        }

    },

}