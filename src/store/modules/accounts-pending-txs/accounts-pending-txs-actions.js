export default {

    async processAccountPendingTransactions({dispatch, state, getters, commit }, { publicKey, list  }){

        const map = {}
        if (list) list.map( it => map[it] = true )

        commit('setPendingList', { publicKey, map })
    },

    async accountPendingTransactionsTxUpdateNotification({dispatch, state, getters, commit}, {publicKey, txHash, extraInfo }){

        if (extraInfo.blockchain){
            commit('updatePendingList', {publicKey, txHash, inserted: false})
        } else if (extraInfo.mempool) {

            if (extraInfo.mempool.inserted){
                commit('updatePendingList', {publicKey, txHash, inserted: true })
            }else {
                commit('updatePendingList', {publicKey, txHash, inserted: false })
            }

        } else throw "Invalid extraInfo"

    }

}