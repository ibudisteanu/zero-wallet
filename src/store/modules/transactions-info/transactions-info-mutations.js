import Vue from "vue";

export default {

    setTransactionInfo(context, {hash, txInfo} ){
        Vue.set(context.list, hash, txInfo)
    },

    deleteTransactionsInfo(state, transactions ){

        const list = state.list

        for (const tx of transactions)
            delete list[tx.hash]

        state.list = {...list}
    },

    updateTxInfoNotification(state, {txHash, extraInfo }) {

        const txInfo = {...state.list[txHash]};

        if (extraInfo.blockchain){

            if (extraInfo.blockchain.inserted){
                txInfo.blkHeight = extraInfo.blockchain.blkHeight
                txInfo.timestamp = extraInfo.blockchain.blkTimestamp
                txInfo.height = extraInfo.blockchain.height
                delete txInfo.mempool
            } else {
                delete txInfo.blkHeight
                delete txInfo.timestamp
                delete txInfo.height
            }

        } else if (extraInfo.mempool) {

            delete txInfo.blkHeight
            delete txInfo.timestamp
            delete txInfo.height

            if (extraInfo.mempool.inserted)
                txInfo.mempool = true
            else
                delete txInfo.mempool

        }

        Vue.set(state.list, txHash, txInfo );
    },

}
