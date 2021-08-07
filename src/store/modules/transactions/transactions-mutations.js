import Vue from 'vue';

export default {

    setSubscribedTxStatus(state, {txId, status} ){
        if (status) Vue.set(state.subscribed, txId, true)
        else Vue.delete(state.subscribed, txId)
    },

    deleteTransactions(state, transactions ){

        const {txsByHash,txsByHeight} = state

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
        const {txsByHash,txsByHeight} = state

        for (const tx of txs){

            tx.__timestampUsed = timestamp

            if (overwrite || !txsByHash[tx.hash] ){

                const oldTx  = txsByHash[tx.hash]
                if (oldTx && oldTx.__height !== undefined)
                    delete txsByHeight[oldTx__height]

                txsByHash[tx.hash] = tx
                if (tx.__height !== undefined)
                    txsByHeight[tx.__height] = tx
            }

        }

        state.txsByHash = {...txsByHash}
        state.txsByHeight = {...txsByHeight}
    },

    addViewTransactionsHashes(state, txsHashes ) {
        const viewTxsHashes = {...state.viewTxsHashes}
        for (const txHash of txsHashes ) viewTxsHashes[txHash] = true
        state.viewTxsHashes = viewTxsHashes
    },

    removeViewTransactionsHashes(state, txsHashes ) {
        const viewTxsHashes = {...state.viewTxsHashes}
        for (const txHash of txsHashes ) delete viewTxsHashes[txHash]
        state.viewTxsHashes = viewTxsHashes
    },

    txNotification(state, {txHash, extraInfo }) {

        const tx = {...state.txsByHash[txHash]};

        let removedHeight, addedHeight
        if (tx.__height !== undefined)
            removedHeight = tx.__height

        if (extraInfo.inserted){
            delete tx.__mempool
            tx.__blkHeight = extraInfo.blkHeight
            tx.__timestamp = extraInfo.blkTimestamp
            tx.__height = extraInfo.height
            addedHeight = tx.height
        } else {
            delete tx.__blkHeight
            delete tx.__timestamp
            delete tx.__height
        }

        Vue.set(state.txsByHash, txHash, tx );
        if (addedHeight !== undefined) Vue.set(state.txsByHeight, addedHeight, tx );
        if (removedHeight !== undefined) Vue.delete(state.txsByHeight, removedHeight);
    },

}
