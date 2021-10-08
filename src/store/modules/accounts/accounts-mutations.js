import Vue from "vue";

export default {

    setAccount(state, {publicKey, account  }){

        if (account && account.tokens)
            for (let i=0; i < account.tokens.length; i++)
                account.accounts[i].token = account.tokens[i]

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
