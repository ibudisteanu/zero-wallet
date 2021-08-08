import Vue from "vue";
import consts from "../../../../consts/consts";

export default {

    setAccountTxsViewPosition(state, {publicKeyHash, data } ){
        Vue.set( state.viewTxsPositions, publicKeyHash,  data  )
    },

    setAccountTxs(state, {publicKeyHash, starting, accountTxs }){

        const obj = {
            hashes: {},
            count: 0,
        };

        if (accountTxs){
            obj.count = accountTxs.count

            accountTxs.txs = (accountTxs.txs||[]).reverse()
            for (let i=0; i < accountTxs.txs.length; i++)
                obj.hashes[starting + i ] = accountTxs.txs[i]
        } else {
            obj.count = 0
            obj.next = 0
        }

        Vue.set(state.list, publicKeyHash, obj );
    },

    addAccountTxUpdateNotification(state, {publicKeyHash, txHash, extraInfo }){

        if (!extraInfo.blockchain) return

        const obj = {
            hashes: {},
            count: 0,
            ...state.list[publicKeyHash]
        };

        if (!extraInfo.blockchain.inserted){ //removed
            obj.count -= 1
            delete obj.hashes[ extraInfo.blockchain.txsCount ]
        } else {
            obj.count += 1
            obj.hashes[ extraInfo.blockchain.txsCount ] = txHash
        }

        const viewTxsPositions = state.viewTxsPositions[publicKeyHash]
        if (viewTxsPositions) {
            let c = 0
            for (const heightStr in obj.hashes) {
                const height = Number.parseInt(heightStr)
                if (height < viewTxsPositions.starting || height > viewTxsPositions.ending)
                    c++
            }

            if (c >= consts.addressTxsPagination)
                for (const heightStr in obj.hashes) {
                    const height = Number.parseInt(heightStr)
                    if (height < viewTxsPositions.starting || height > viewTxsPositions.ending)
                        delete obj.hashes[heightStr]
                }
        } else {
            for (const heightStr in obj.hashes) {
                const height = Number.parseInt(heightStr)
                if ( height > obj.count || height < obj.count - consts.addressTxsPagination )
                    delete(obj.hashes[height])
            }
        }

        Vue.set(state.list, publicKeyHash, obj );
    }

}