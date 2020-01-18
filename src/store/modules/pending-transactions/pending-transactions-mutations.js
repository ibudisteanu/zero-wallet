import Vue from 'vue';

export default {

    clearPendingTransaction(context, ) {

        context.pendingTransactions = {};

    },

    setPendingTransaction(context, { transactions }) {

        for (const key in transactions)
            Vue.set(context.pendingTransactions, key, transactions[key]);


    }

}