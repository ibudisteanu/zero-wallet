import Vue from 'vue';

export default {

    deleteTransactions(state, transactions ){
        for (const tx of transactions) {
            Vue.delete(state.txsByHash, tx.bloom.hash);

            if (tx.__extra.height !== undefined)
                Vue.delete( state.txsByHeight, tx.__extra.height);
        }
    },


    setTransactions( state, txs ) {

        const timestamp = new Date().getTime()

        for (const tx of txs){

            tx.__timestampUsed = timestamp

            Vue.set( state.txsByHash, tx.bloom.hash,  tx);

            if (tx.__extra.height !== undefined)
                Vue.set( state.txsByHeight, tx.__extra.height,  tx);

        }

    },

    setViewTransactionsHashes(state, txsHashes) {
        state.viewTransactionsHashes = txsHashes
    }


}
