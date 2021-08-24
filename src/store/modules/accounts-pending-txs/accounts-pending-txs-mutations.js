import Vue from "vue";

export default {

    setPendingList(state, {publicKey, map }){
        Vue.set(state.list, publicKey, map )
    },

    updatePendingList(state, {publicKey, txHash, inserted }){
        const map = {...state.list[publicKey]}

        if (!inserted)
            delete map[txHash]
        else
            map[txHash] = true

        Vue.set(state.list, publicKey, map)
    },

}