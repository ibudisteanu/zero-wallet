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
                    delete txsByHeight[oldTx.__height]

                txsByHash[tx.hash] = tx
                if (tx.__height !== undefined)
                    txsByHeight[tx.__height] = tx
            }

        }

        state.txsByHash = {...txsByHash}
        state.txsByHeight = {...txsByHeight}
    },

    updateViewTransactionsHashes(state, {txsHashes, insert} ) {
        const viewTxsHashes = {...state.viewTxsHashes}
        for (const txHash of txsHashes ){
            if (insert) viewTxsHashes[txHash] = true
            else delete viewTxsHashes[txHash]
        }
        state.viewTxsHashes = viewTxsHashes
    },

    updateTxNotification(state, {txHash, extraInfo }) {

        const tx = {...state.txsByHash[txHash]};
        if (!tx) return

        const removedHeight = tx.__height
        let addedHeight

        if (extraInfo.blockchain){

            if (extraInfo.blockchain.inserted){
                tx.__blkHeight = extraInfo.blockchain.blkHeight
                tx.__timestamp = extraInfo.blockchain.blkTimestamp
                tx.__height = extraInfo.blockchain.height
                addedHeight = extraInfo.blockchain.height
                delete tx.__mempool
            } else {
                delete tx.__blkHeight
                delete tx.__timestamp
                delete tx.__height
            }

        } else if (extraInfo.mempool) {

            delete tx.__blkHeight
            delete tx.__timestamp
            delete tx.__height

            if (extraInfo.mempool.inserted){
                tx.__mempool = true
            } else {
                delete tx.__mempool
            }

        } else {
            throw("Invalid notification")
        }

        Vue.set(state.txsByHash, txHash, tx );
        if (addedHeight !== undefined) Vue.set(state.txsByHeight, addedHeight, tx );
        if (removedHeight !== undefined && addedHeight !== removedHeight) Vue.delete(state.txsByHeight, removedHeight);
    },

}
