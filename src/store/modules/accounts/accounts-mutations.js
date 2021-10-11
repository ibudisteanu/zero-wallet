import Vue from "vue";

export default {

    setAccount(state, {publicKey, account  }){

        if (account && account.assets)
            for (let i=0; i < account.assets.length; i++)
                account.accounts[i].asset = account.assets[i]

        Vue.set(state.list, publicKey, account );
    },

    removeAccount(state, { publicKey }){
        Vue.delete(state.list, publicKey );
    },

    setSubscribedAccountStatus(state, {publicKey,status} ){
        if (status) Vue.set(state.subscribed, publicKey, true)
        else Vue.delete(state.subscribed, publicKey)
    },

}
