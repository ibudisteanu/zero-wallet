export default {

    setSubscribedTxStatus(state, {txId, status} ){
        if (status) state.subscribed[txId] = true
        else delete state.subscribed[txId]
    },

    deleteTransactions(state, transactions ){

        for (const tx of transactions) {
            delete state.txsByHash[tx.hash]

            if (tx.__height !== undefined)
                delete state.txsByHeight[tx.__height]
        }

    },


    setTransactions( state, {txs, overwrite = true } ) {
        const timestamp = new Date().getTime()

        for (const tx of txs){
            tx.__timestampUsed = timestamp
            if (overwrite || !state.txsByHash[tx.hash] ){

                const oldTx  = state.txsByHash[tx.hash]
                if (oldTx && oldTx.__height !== undefined) delete state.txsByHeight[oldTx.__height]

                state.txsByHash[tx.hash] = tx
                if (tx.__height !== undefined) state.txsByHeight[tx.__height] = tx
            }
        }

    },

    updateViewTransactionsHashes(state, {txsHashes, insert} ) {
        if (!txsHashes) return

        for (const txHash of txsHashes ){
            if (!txHash)continue
            if (insert) state.viewTxsHashes[txHash] = true
            else delete state.viewTxsHashes[txHash]
        }

    },

    updateTxNotification(state, {txHash, extraInfo }) {
        if (!state.txsByHash[txHash]) return

        const tx = state.txsByHash[txHash]

        const removedHeight = tx.__height

        if (extraInfo.blockchain) {
            if (extraInfo.blockchain.inserted) tx.__height = extraInfo.blockchain.height
            else delete tx.__height
        } else if (extraInfo.mempool) delete tx.__height

        let addedHeight
        if (extraInfo.blockchain && extraInfo.blockchain.inserted) addedHeight = extraInfo.blockchain.height

        if (addedHeight !== undefined) state.txsByHeight[addedHeight] = tx
        if (removedHeight !== undefined && addedHeight !== removedHeight) delete state.txsByHeight[ removedHeight ];
    },

}
