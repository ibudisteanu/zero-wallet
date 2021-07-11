import Vue from "vue";

export default {

    addAddress( context, address ){
        Vue.set(context.list, address.publicKeyHash, address );
    },

    setTransparentAddressUpdate(context, {account, publicKeyHash }){
        Vue.set(context.accounts, publicKeyHash, account );
    },

    accountNotification(context, {account, publicKeyHash}){
        Vue.set(context.accounts, publicKeyHash, account );
    },

    setAccountTxs(context, {publicKeyHash, starting, accountTxs }){

        const obj = {
            hashes: {},
        };

        if (accountTxs){
            obj.count = accountTxs.count
            for (let i=0; i < accountTxs.txs.length; i++)
                obj.hashes[starting + i] = accountTxs.txs[i]
        } else {
            obj.count = 0
            obj.next = 0
        }

        Vue.set(context.txs, publicKeyHash, obj );
    },

    accountTxUpdateNotification(context, {publicKeyHash, txHash, extraInfo, accountsTxsPosition }){

        const obj = { ... context.txs[publicKeyHash]  };

        if (!extraInfo.inserted){ //removed
            obj.count -= 1

            if ( obj.hashes[ extraInfo.txsCount ])
                delete obj.hashes[ extraInfo.txsCount ]

        } else {
            obj.count += 1

            if (!obj.hashes[ extraInfo.txsCount ])
                obj.hashes[ extraInfo.txsCount ] = txHash
        }

        if (accountsTxsPosition)
            for (const heightStr in obj.hashes) {
                const height = Number.parseInt(heightStr)
                if (height < accountsTxsPosition.starting || height > accountsTxsPosition.ending)
                    delete obj.hashes[heightStr]
            }

        Vue.set(context.txs, publicKeyHash, obj );
    }


}
