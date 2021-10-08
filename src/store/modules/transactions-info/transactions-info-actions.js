export default {

    storeTransactionInfo( {state, dispatch, commit, getters}, { hash, txInfo }){
        commit('setTransactionInfo', {hash, txInfo})
    },

    txInfoNotification({state, commit}, { txHash, extraInfo }) {
        commit('updateTxInfoNotification', { txHash, extraInfo })
    }

}