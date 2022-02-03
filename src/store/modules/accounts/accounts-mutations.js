export default {

    setAccount(state, {publicKey, account  }){
        state.list[publicKey] = account ? {...account} : null
    },

    removeAccount(state, { publicKey }){
        delete state.list[ publicKey] ;
    },

    setSubscribedAccountStatus(state, {publicKey,status} ){
        if (status) state.subscribed[publicKey] = true
        else delete state.subscribed[publicKey]
    },

}
