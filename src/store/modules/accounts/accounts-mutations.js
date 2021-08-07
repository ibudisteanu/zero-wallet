import Vue from "vue";

export default {

    setAccount(state, {publicKeyHash, account  }){
        Vue.set(state.list, publicKeyHash, account );
    },

    removeAccount(state, { publicKeyHash }){
        Vue.delete(state.list, publicKeyHash );
    },

    setSubscribedAccountStatus(state, {publicKeyHash,status} ){
        if (status) Vue.set(state.subscribed, publicKeyHash, true)
        else Vue.delete(state.subscribed, publicKeyHash)
    },

}
