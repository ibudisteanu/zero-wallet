import Vue from "vue";

export default {

    setPendingList(state, {publicKeyHash, map }){
        Vue.set(state.list, publicKeyHash, map )
    },

    updatePendingList(state, {publicKeyHash, txHash, inserted }){
        const map = {...state.list[publicKeyHash]}

        if (!inserted)
            delete map[txHash]
        else
            map[txHash] = true

        Vue.set(state.list, publicKeyHash, map)
    },

}