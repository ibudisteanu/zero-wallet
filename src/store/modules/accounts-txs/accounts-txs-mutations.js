import Vue from "vue";
import consts from "consts/consts";
import Decimal from "decimal.js"

export default {

    setAccountTxsViewPosition(state, {publicKey, data } ){
        Vue.set( state.viewTxsPositions, publicKey,  data  )
    },

    setAccountTxs(state, {publicKey, starting, accountTxs }){

        const obj = {
            hashes: {},
            count: new Decimal(0),
        };

        if (accountTxs){
            obj.count = accountTxs.count

            accountTxs.txs = (accountTxs.txs||[]).reverse()
            for (let i=0; i < accountTxs.txs.length; i++)
                obj.hashes[ starting.plus( i ) ] = accountTxs.txs[i]

            console.log(obj.hashes)
        } else {
            obj.count = new Decimal(0)
            obj.next = new Decimal(0)
        }

        Vue.set(state.list, publicKey, obj );
    },

    addAccountTxUpdateNotification(state, {publicKey, txHash, extraInfo }){

        if (!extraInfo.blockchain) return

        const obj = {
            hashes: {},
            count: 0,
            ...state.list[publicKey]
        };

        if (!extraInfo.blockchain.inserted){ //removed
            obj.count -= 1
            delete obj.hashes[ extraInfo.blockchain.txsCount ]
        } else {
            obj.count += 1
            obj.hashes[ extraInfo.blockchain.txsCount ] = txHash
        }

        const viewTxsPositions = state.viewTxsPositions[publicKey]
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

        Vue.set(state.list, publicKey, obj );
    }

}