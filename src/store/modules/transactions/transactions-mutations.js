import Vue from 'vue';

export default {

    deleteTransactions(context, {transactions}){

        for (const key in transactions)
            Vue.delete(context.list, key);

    },

    setTransactions(context, { transactions }) {

        const list = {... ( context.list || {} ) };

        for (const key in transactions)
            list[key] = transactions[key];

        context.list = list;
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