const promises = {
    accounts: {},
    unsubscribed: {},
    subscribed: {},
}

export default {

    async _downloadAccount({state, dispatch, commit, getters}, publicKey){

        if (promises.accounts[publicKey]) return promises.accounts[publicKey]

        if (promises.accounts[publicKey]) return promises.accounts[publicKey];
        return promises.accounts[publicKey] = new Promise( async (resolve, reject) => {
            try{

                const result = await Promise.all([
                    PandoraPay.network.getNetworkAccount(publicKey),
                    PandoraPay.network.getNetworkAccountMempool(publicKey),
                ])

                if ( !result[0] ) throw "Account was not received"
                const accountData = result[0]

                let account = JSON.parse(MyTextDecoder.decode(accountData))
                const pendingTxsList = JSON.parse( MyTextDecoder.decode(result[1]) )

                if ( !Object.keys(account).length ){
                    account = null
                    result[0] = null
                }

                if (account){

                    if (account.accounts)
                        await Promise.all( account.tokens.map( token => dispatch('getTokenByHash', token) ) )

                    if (account.plainAccount)
                        await dispatch('getTokenByHash', "")
                }

                await PandoraPay.store.storeAccount( publicKey,  result[0] )

                await dispatch('processAccountPendingTransactions', {publicKey, list: pendingTxsList })

                commit('setAccount', { publicKey, account })

                resolve(account)
            }catch(err){
                console.error(err)
                reject(err)
            }finally{
                delete promises.accounts[publicKey];
            }
        })
    },

    async subscribeAccount({state, dispatch, commit}, publicKey){

        if (state.subscribed[publicKey])
            return dispatch('_downloadAccount', publicKey)

        if (promises.subscribed[publicKey]) return promises.subscribed[publicKey];
        return promises.subscribed[publicKey] = new Promise( async (resolve, reject) => {

            try{

                await Promise.all([
                    PandoraPay.network.subscribeNetwork( publicKey, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT ),
                    PandoraPay.network.subscribeNetwork( publicKey, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT_TRANSACTIONS ),
                ])

                commit('setSubscribedAccountStatus', {publicKey, status: true})

                resolve( await dispatch('_downloadAccount', publicKey) )

            }catch(err){
                reject(err)
            }finally{
                delete promises.subscribed[publicKey];
            }

        })
    },

    async unsubscribeAccount({state, dispatch, commit}, publicKey){

        if (!state.subscribed[publicKey])
            return false

        if (promises.unsubscribed[publicKey]) return promises.unsubscribed[publicKey]
        return promises.unsubscribed[publicKey] = new Promise( async(resolve, reject)=>{
            try{

                await Promise.all([
                    PandoraPay.network.unsubscribeNetwork( publicKey, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT ),
                    PandoraPay.network.unsubscribeNetwork( publicKey, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT_TRANSACTIONS)
                ]);

                await PandoraPay.store.storeAccount( publicKey, null )

                commit('removeAccount', { publicKey })

                commit('setSubscribedAccountStatus', {publicKey, status: false})

                resolve(true)
            }catch(err){
                reject(err)
            }finally{
                delete promises.unsubscribed[publicKey]
            }
        })

    },

    async accountUpdateNotification( {state, dispatch, commit, getters}, {publicKey, type, data, extraInfo }){

        let account = { ... ( state.list[publicKey] || {} ) }

        if (type === PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT){

            const {token} = extraInfo
            if (data === null ){

                if (account.tokens ) {
                    for (let index = 0; index < account.tokens.length; index++)
                        if (account.tokens[index] === token) {
                            account.tokens.slice(index, 1)
                            account.accounts.slice(index, 1)
                            break
                        }
                    if (!account.tokens.length){
                        delete account.tokens
                        delete account.accounts
                    }
                }

            } else {

                if (!account.tokens){
                    account.tokens = []
                    account.accounts = []
                }

                let found = false
                for (let index = 0; index < account.tokens.length; index++)
                    if (account.tokens[index] === token) {
                        account.accounts[index] = data
                        found = true
                        break
                    }

                if (!found){
                    account.tokens.push(token)
                    account.accounts.push(data)
                }

            }

        } else if (type === PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_PLAIN_ACCOUNT){

            if (data === null )
                delete account.plainAccount
            else
                account.plainAccount = data

        }else if (type === PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_REGISTRATION){
            if (data === null ){
                account.registration = data
            } else {
                delete account.registration
            }
        }

        if (!Object.keys(account).length)
            account = null

        await PandoraPay.store.storeAccount( publicKey, MyTextEncoder.encode(JSON.stringify(account)) )
        commit('setAccount', {publicKey, account})

    },

}
