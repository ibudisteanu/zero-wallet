import Vue from "vue";

export default {

    setAddresses( context, value){
        context.list = value;
    },

    setAddressTxCounts(context, {account, txCount = 0, txCountPending = 0}){

        const address = { ... context.list[account]  };

        address.txCount = txCount;
        address.txCountPending = txCountPending;

        Vue.set(context.list, account, address );

    },

    setAddressPendingTxs(context, {account, txs, next, clear = true}){

        const address = { ... context.list[account]  };

        if (!address.pendingTxs) address.pendingTxs = {};

        if (clear === true)
            address.pendingTxs = {};

        for (const key in txs)
            address.pendingTxs[key] = key;

        address.pendingTxsNext = next;

        Vue.set(context.list, account, address );

    },

    setAddressTxs(context, {account, txs}){

        const address = { ... context.list[account]  };

        if (!address.txs) address.txs = {};

        let minimumIndex = Number.MAX_SAFE_INTEGER;
        for (const txIndex in txs) {

            if (address.txs[txIndex] ) {

                const txIndexNumber = Number.parseInt(txIndex);

                if (address.txs[txIndex] !== txs[txIndex].toString("hex"))
                    minimumIndex = Math.min(minimumIndex, txIndexNumber );
                else
                if ( minimumIndex < txIndexNumber  ) minimumIndex = Number.MAX_SAFE_INTEGER;
            }

            address.txs[txIndex] = txs[txIndex].toString("hex");
        }

        if (minimumIndex !== Number.MAX_SAFE_INTEGER){

            for (const txIndex in address.txs)
                if (Number.parseInt(txIndex) < minimumIndex)
                    delete address[txIndex];

        }

        let txsLowestIndex = Number.MAX_SAFE_INTEGER;
        for (const txIndex in address.txs)
            txsLowestIndex = Math.min(txsLowestIndex, Number.parseInt(txIndex) );

        address.txsLowestIndex = txsLowestIndex;

        Vue.set(context.list, account, address );

    },

    setAddressUpdate(context, {account, balances, nonce, delegate}){

        const address = { ... context.list[account]  };

        const balancesObj = {};

        if (balances)
            for (const balance of balances)
                balancesObj[ balance.tokenCurrency.toString("hex") ] = balance.amount;

        address.balances = balancesObj;
        address.nonce = nonce;
        address.delegate = delegate;
        address.loaded = true;

        Vue.set(context.list, account, address );

    },



}