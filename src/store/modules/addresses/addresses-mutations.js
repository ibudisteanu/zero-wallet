import Vue from "vue";

export default {

    addAddress( context, address ){
        Vue.set(context.list, address.publicKeyHash, address );
    },

    addAddresses( context, addresses ){
        for (const publicKeyHash in addresses ){
            Vue.set(context.list, publicKeyHash, addresses[publicKeyHash] );
        }
    },

    setTransparentAddressUpdate(context, {account, publicKeyHash }){

        const address = { ... context.list[publicKeyHash]  };
        address.account = account
        address.loaded = true;

        Vue.set(context.list, publicKeyHash, address );
    },

    setAccountTxs(context, {publicKeyHash, next, accountTxs }){

        const address = { ... context.list[publicKeyHash]  };

        address.txs = address.txs || {
            count: 0,
            list: [],
            next: 0,
        }

        if (accountTxs){
            if (next === 0){
                address.txs.count = accountTxs.next + accountTxs.txs.length
            }
            address.txs.next = accountTxs.next

            for (const hash of accountTxs.txs){
                address.txs.list.push(hash)
            }
        }

        Vue.set(context.list, publicKeyHash, address );
    }

}
