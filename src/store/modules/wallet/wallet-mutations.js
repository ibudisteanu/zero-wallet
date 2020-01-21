import Vue from 'vue';

export default {

    setLoggedIn( context, value){
        context.loggedIn = value;
    },

    setEncrypted( context, value ){
        context.encrypted = value;
    },
    setVersion( context, value){
        context.version = value;
    },

    setAddresses( context, value){
        context.addresses = value;
    },

    setAddressTxCounts(context, {account, txCount}){

        const address = {...context.addresses[account]};
        address.txCount = txCount;

        Vue.set(context.addresses, account, address );

    },

    setAddressTxs(context, {account, txs}){

        const address = {...context.addresses[account]};

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

        Vue.set(context.addresses, account, address );

    },

    setAddressBalances(context, {account, balances, nonce}){

        const address = {...context.addresses[account]};

        address.balances = balances;
        address.nonce = nonce;
        address.loaded = true;

        Vue.set(context.addresses, account, address );

    },

    setMainAddress( context, value){
        context.mainAddress = value;
        localStorage.setItem('mainAddress', value);
    },
    setLoaded(context, value){
        context.loaded = value;
    },

    setIsLoading(context, value){
        context.isLoading = value;
    },

    walletClear(context){

        context.loaded = false;
        context.loggedIn = false;
        context.encrypted = null;
        context.version = null;
        context.addresses = {};
        context.mainAddress = null;

        context.isLoading = false;

        localStorage.removeItem('mainAddress');
    }
}