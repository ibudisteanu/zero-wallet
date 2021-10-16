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

                let account = JSON.parse(MyTextDecode(accountData))
                const pendingTxsList = JSON.parse( MyTextDecode(result[1]) )

                if ( !Object.keys(account).length ){
                    account = null
                    result[0] = null
                }

                if (account){

                    if (account.accounts)
                        await Promise.all( account.assets.map( asset => dispatch('getAssetByHash', asset) ) )

                    if (account.plainAccount)
                        await dispatch('getAssetByHash', PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX )
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

            const {asset} = extraInfo
            if (data === null ){

                if (account.assets ) {
                    for (let index = 0; index < account.assets.length; index++)
                        if (account.assets[index] === asset) {
                            account.assets.slice(index, 1)
                            account.accounts.slice(index, 1)
                            break
                        }
                    if (!account.assets.length){
                        delete account.assets
                        delete account.accounts
                    }
                }

            } else {

                if (!account.assets){
                    account.assets = []
                    account.accounts = []
                }

                let found = false
                for (let index = 0; index < account.assets.length; index++)
                    if (account.assets[index] === asset) {
                        account.accounts[index] = data
                        account.accounts[index].asset = asset
                        found = true
                        break
                    }

                if (!found){
                    account.assets.push(asset)
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

        await PandoraPay.store.storeAccount( publicKey, MyTextEncode(JSON.stringify(account)) )
        commit('setAccount', {publicKey, account})

    },

}
