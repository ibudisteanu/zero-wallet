import Vue from "vue";

export default {

    setAccount(state, {publicKey, account  }){

        if (account){
            if (account.accountsExtra)
                for (let i=0; i < account.accountsExtra.length; i++) {
                    account.accounts[i].asset = account.accountsExtra[i].asset
                    account.accounts[i].index = account.accountsExtra[i].index
                }

            if (account.plainAccount)
                account.plainAccount.index = account.plainAccountExtra.index

            if (account.registration)
                account.registration.index = account.registrationExtra.index
        }

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
