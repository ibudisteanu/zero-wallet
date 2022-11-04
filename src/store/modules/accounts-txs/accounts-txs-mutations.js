import consts from "consts/consts";
import Decimal from "decimal.js"

export default {

    setAccountTxsViewPosition(state, {publicKey, data } ){
        state.viewTxsPositions [ publicKey ] = data
    },

    setAccountTxs(state, {publicKey, starting, accountTxs }){

        const obj = {
            hashes: {},
            count: Decimal_0,
        };

        if (accountTxs){
            obj.count = accountTxs.count

            accountTxs.txs = (accountTxs.txs||[]).reverse()
            for (let i=0; i < accountTxs.txs.length; i++)
                obj.hashes[ starting.plus( i ) ] = accountTxs.txs[i]

            console.log(obj.hashes)
        } else {
            obj.count = Decimal_0
            obj.next = Decimal_0
        }

        state.list[publicKey] = obj
    },

    addAccountTxUpdateNotification(state, { publicKey, txHash, extraInfo }){

        if (!extraInfo.blockchain) return

        const obj = state.list[publicKey] || {}
        if (!obj.hashes) obj.hashes = {}
        if (!obj.count) obj.count = Decimal_0

        if (!extraInfo.blockchain.inserted){ //removed
            obj.count = obj.count.minus(1)
            delete obj.hashes[ extraInfo.blockchain.txsCount ]
        } else {
            for (const key in obj.hashes)
                if (obj.hashes[key] === txHash)
                    return  //already processed

            obj.count = obj.count.plus(1)
            obj.hashes[ extraInfo.blockchain.txsCount ] = txHash
        }

        const viewTxsPositions = state.viewTxsPositions[publicKey]
        if (viewTxsPositions) {
            let c = 0
            for (const heightStr in obj.hashes) {
                const height = new Decimal(heightStr)
                if (height.lt(viewTxsPositions.starting) || height.gt( viewTxsPositions.ending ) )
                    c++
            }

            if (c >= consts.addressTxsPagination)
                for (const heightStr in obj.hashes) {
                    const height = new Decimal(heightStr)
                    if (height.lt( viewTxsPositions.starting ) || height.gt( viewTxsPositions.ending ) )
                        delete obj.hashes[heightStr]
                }
        } else {
            for (const heightStr in obj.hashes) {
                const height = new Decimal(heightStr)
                if ( height.gt(obj.count) || height.lt( obj.count.minus( consts.addressTxsPagination ) ) )
                    delete(obj.hashes[height])
            }
        }

        state.list[publicKey] = obj
    }

}