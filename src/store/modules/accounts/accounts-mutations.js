import Vue from "vue";

export default {

    setAccount(state, {publicKey, account  }){
        Vue.set(state.list, publicKey, account ? {...account} : null );
    },

    removeAccount(state, { publicKey }){
        Vue.delete(state.list, publicKey );
    },

    setSubscribedAccountStatus(state, {publicKey,status} ){
        if (status) Vue.set(state.subscribed, publicKey, true)
        else Vue.delete(state.subscribed, publicKey)
    },

}
