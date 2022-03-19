export default {

    setAccount(state, {publicKey, account  }){
        if (account){
            if (account.accountsExtra) {
                for (let i = 0; i < account.accountsExtra.length; i++) {
                    account.accounts[i].asset = account.accountsExtra[i].asset
                    account.accounts[i].index = account.accountsExtra[i].index
                }
                delete account.accountsExtra
            }

            if (account.plainAccountExtra) {
                account.plainAccount.index = account.plainAccountExtra.index
                delete account.plainAccountExtra
            }

            if (account.registrationExtra) {
                account.registration.index = account.registrationExtra.index
                delete account.registrationExtra
            }
        }

        state.list[publicKey] = account
    },

    removeAccount(state, { publicKey }){
        delete state.list[ publicKey] ;
    },

    setSubscribedAccountStatus(state, {publicKey,status} ){
        if (status) state.subscribed[publicKey] = true
        else delete state.subscribed[publicKey]
    },

}
