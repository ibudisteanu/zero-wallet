import Vue from "vue";

export default {

    addAddress( context, address ){
        Vue.set(context.list, address.publicKeyHash, address );
    },

    setTransparentAddressUpdate(context, {account, publicKeyHash }){
        Vue.set(context.accounts, publicKeyHash, account );
    },

    setAccountTxs(context, {publicKeyHash, next, accountTxs }){

        const obj = { ... context.txs[publicKeyHash]  };

        obj.list = []

        if (accountTxs){
            obj.count = accountTxs.count
            for (const hash of accountTxs.txs)
                obj.list.push(hash)
        } else {
            obj.count = 0
            obj.next = 0
        }

        Vue.set(context.txs, publicKeyHash, obj );
    }

}
