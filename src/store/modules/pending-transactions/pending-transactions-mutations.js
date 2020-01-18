import Vue from 'vue';

export default {

    clearPendingTransaction(context, ) {

        context.list = {};

    },

    setPendingTransactions(context, { transactions, clear = false }) {

        if (clear)
            context.list = {};

        for (const key in transactions)
            Vue.set(context.list, key, transactions[key]);


    }

}