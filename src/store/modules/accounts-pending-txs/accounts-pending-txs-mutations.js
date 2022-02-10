export default {

    setPendingList(state, {publicKey, map }){
        state.list[ publicKey ] = map
    },

    updatePendingList(state, {publicKey, txHash, inserted }){
        const map = {...state.list[publicKey]}

        if (!inserted)
            delete map[txHash]
        else
            map[txHash] = true

        state.list[publicKey] = map
    },

}