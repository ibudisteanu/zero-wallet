export default {

    setSubscribedTxPreviewStatus(state, {txId, status}) {
        if (status) state.subscribed[txId] = true
        else delete state.subscribed[txId]
    },

    deleteTransactionsPreview(state, transactions) {

        const txsByHash = {...state.txsByHash}

        for (const tx of transactions)
            delete txsByHash[tx.hash]

        state.txsByHash = txsByHash
    },

    setTransactionsPreview( state, {txs, overwrite = true } ) {
        const timestamp = new Date().getTime()
        const txsByHash = {...state.txsByHash}

        for (const tx of txs){
            tx.__timestampUsed = timestamp
            if (overwrite || !txsByHash[tx.hash] )
                txsByHash[tx.hash] = tx
        }

        state.txsByHash = txsByHash
    },

    updateViewTransactionsPreviewHashes(state, {txsHashes, insert} ) {
        if (!txsHashes || !txsHashes.length) return
        const viewTxsHashes = {...state.viewTxsHashes}

        for (const txHash of txsHashes ){
            if (insert) viewTxsHashes[txHash] = true
            else delete viewTxsHashes[txHash]
        }
        state.viewTxsHashes = viewTxsHashes
    },

    updateTxPreviewNotification(state, {txHash, extraInfo }) {

        if (!state.txsByHash[txHash]) return

        const tx = {...state.txsByHash[txHash]}

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

        state.txsByHash[txHash] = tx
    },

}