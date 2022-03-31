export default {

    setPendingList(state, {publicKey, map }){
        state.list[ publicKey ] = map
    },

    updatePendingList(state, {publicKey, txHash, inserted }){

        if (!inserted)
            delete state.list[publicKey][txHash]
        else
            state.list[publicKey][txHash] = true

    },

}