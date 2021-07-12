import Vue from 'vue';

export default {

    deleteTransactions(context, {transactions}){
        for (const key in transactions)
            Vue.delete(context.txsByHash, key);
    },


    setTransactions( state, txs ) {

        for (const tx of txs){
            Vue.set( state.txsByHash, tx.bloom.hash,  tx);

            if (tx.__extra.height !== undefined)
                Vue.set( state.txsByHeight, tx.__extra.height,  tx);
        }

    }

}
