import Vue from 'vue';

export default {

    setSubscribedTxStatus(state, {txId, status} ){
        if (status) Vue.set(state.subscribed, txId, true)
        else Vue.delete(state.subscribed, txId)
    },

    deleteTransactions(state, transactions ){

        const {txsByHash,txsByHeight} = state

        for (const tx of transactions) {
            delete txsByHash[tx.bloom.hash]

            if (tx.__extra.height !== undefined)
                delete txsByHeight[tx.__extra.height]
        }
        state.txsByHash = {...txsByHash}
        state.txsByHeight = {...txsByHeight}
    },


    setTransactions( state, txs ) {

        const timestamp = new Date().getTime()
        const {txsByHash,txsByHeight} = state

        for (const tx of txs){

            tx.__timestampUsed = timestamp

            txsByHash[tx.bloom.hash] = tx

            if (tx.__extra.height !== undefined)
                txsByHeight[tx.__extra.height] = tx
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
        if (tx.__extra.height !== undefined)
            removedHeight = tx.__extra.height

        if (extraInfo.inserted){
            delete tx.__extra.mempool
            tx.__extra.blkHeight = extraInfo.blkHeight
            tx.__extra.timestamp = extraInfo.blkTimestamp
            tx.__extra.height = extraInfo.height
            addedHeight = tx.__extra.height
        } else {
            delete tx.__extra.blkHeight
            delete tx.__extra.timestamp
            delete tx.__extra.height
        }

        Vue.set(state.txsByHash, txHash, tx );
        if (addedHeight !== undefined) Vue.set(state.txsByHeight, addedHeight, tx );
        if (removedHeight !== undefined) Vue.delete(state.txsByHeight, removedHeight);
    },

}
