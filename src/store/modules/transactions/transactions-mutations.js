import Vue from 'vue';

export default {

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

        const {viewTransactionsHashes} = state
        for (const txHash of txsHashes )
            viewTransactionsHashes[txHash] = true

        state.viewTransactionsHashes = {...viewTransactionsHashes}
    },

    removeViewTransactionsHashes(state, txsHashes ) {
        const {viewTransactionsHashes} = state
        for (const txHash of txsHashes )
            delete viewTransactionsHashes[txHash]

        state.viewTransactionsHashes = {...viewTransactionsHashes}
    }


}
