import Vue from 'vue';

export default {

    setSubscribedTxStatus(state, {txId, status} ){
        if (status) Vue.set(state.subscribed, txId, true)
        else Vue.delete(state.subscribed, txId)
    },

    deleteTransactions(state, transactions ){

        const txsByHash = state.txsByHash, txsByHeight = state.txsByHeight

        for (const tx of transactions) {
            delete txsByHash[tx.hash]

            if (tx.__height !== undefined)
                delete txsByHeight[tx.__height]
        }
        state.txsByHash = {...txsByHash}
        state.txsByHeight = {...txsByHeight}
    },


    setTransactions( state, {txs, overwrite = true } ) {
        const timestamp = new Date().getTime()
        const txsByHash = state.txsByHash, txsByHeight = state.txsByHeight

        for (const tx of txs){
            tx.__timestampUsed = timestamp
            if (overwrite || !txsByHash[tx.hash] ){

                const oldTx  = txsByHash[tx.hash]
                if (oldTx && oldTx.__height !== undefined) delete txsByHeight[oldTx.__height]

                txsByHash[tx.hash] = tx
                if (tx.__height !== undefined) txsByHeight[tx.__height] = tx
            }
        }

        state.txsByHash = {...txsByHash}
        state.txsByHeight = {...txsByHeight}
    },

    updateViewTransactionsHashes(state, {txsHashes, insert} ) {
        if (!txsHashes) return
        const viewTxsHashes = {...state.viewTxsHashes}

        for (const txHash of txsHashes ){
            if (insert) viewTxsHashes[txHash] = true
            else delete viewTxsHashes[txHash]
        }
        state.viewTxsHashes = viewTxsHashes
    },

    updateTxNotification(state, {txHash, extraInfo }) {
        if (!state.txsByHash[txHash]) return

        const txsByHeight = state.txsByHeight
        const tx = state.txsByHash[txHash];
        if (!tx) return

        const removedHeight = tx.__height

        if (extraInfo.blockchain) {
            if (extraInfo.blockchain.inserted) tx.__height = extraInfo.blockchain.height
            else delete tx.__height
        } else if (extraInfo.mempool) delete tx.__height

        let addedHeight
        if (extraInfo.blockchain && extraInfo.blockchain.inserted) addedHeight = extraInfo.blockchain.height

        if (addedHeight !== undefined) txsByHeight[addedHeight] = tx;
        if (removedHeight !== undefined && addedHeight !== removedHeight) delete(txsByHeight[removedHeight]);

        Vue.set(state.txsByHash, txHash, tx );
        this.txsByHeight = {...txsByHeight}
    },

}
