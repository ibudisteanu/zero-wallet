import Vue from 'vue';

export default {

    deleteTransactions(context, {transactions}){

        for (const key in transactions)
            Vue.delete(context.txsByHash, key);

    },

    setTransactions(context, { transactions }) {

        const list = {... ( context.txsByHash || {} ) };

        for (const key in transactions)
            list[key] = transactions[key];

        context.txsByHash = list;
    },

    setPendingTransactionsCount(context, { count }) {
        context.pendingCount = count;
    },

    setPendingTransactions(context, { txs, next, clear = false }) {


        if (clear) context.pending = {};

        for (const key in txs)
            Vue.set(context.pending, key, txs[key]);

        context.pendingNext = next;

    }

}
