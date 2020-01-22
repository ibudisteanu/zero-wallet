import Vue from 'vue';

export default {

    deleteTransactions(context, {transactions}){

        for (const key in transactions)
            Vue.delete(context.list, key);

    },

    setTransactions(context, { transactions }) {

        for (const key in transactions)
            Vue.set(context.list, key, transactions[key]);

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