const promises = {
    accounts: {},
    unsubscribed: {},
    subscribed: {},
}

export default {

    async _downloadAccount({state, dispatch, commit, getters}, {publicKey, forced}){

        if (!forced && state.subscribed[publicKey] && state.list[publicKey])
            return state.list[publicKey]

        if (promises.accounts[publicKey]) return promises.accounts[publicKey]
        return promises.accounts[publicKey] = new Promise( async (resolve, reject) => {
            try{

                const result = await Promise.all([
                    PandoraPay.network.getNetworkAccount(MyTextEncode( JSONStringify( {publicKey} )) ),
                    PandoraPay.network.getNetworkAccountMempool( MyTextEncode( JSONStringify( {publicKey} ) ) ),
                ])

                if ( !result[0] ) throw "Account was not received"
                const accountData = result[0]

                let account = JSONParse(MyTextDecode(accountData))
                const pendingTxsList = JSONParse( MyTextDecode(result[1]) )

                if ( !Object.keys(account).length ){
                    account = null
                    result[0] = null
                }

                if (account){

                    if (account.accounts)
                        await Promise.all( account.accountsExtra.map( accExtra => dispatch('getAssetByHash', accExtra.asset ) ) )

                    if (account.plainAccount)
                        await dispatch('getAssetByHash', PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64 )
                }

                await dispatch('processAccountPendingTransactions', {publicKey, list: pendingTxsList.list })

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

    async subscribeAccount({state, dispatch, commit}, {publicKey, forced}){

        if (!forced && state.subscribed[publicKey])
            return dispatch('_downloadAccount', {publicKey, forced})

        if (promises.subscribed[publicKey]) return promises.subscribed[publicKey];
        return promises.subscribed[publicKey] = new Promise( async (resolve, reject) => {

            try{

                await Promise.all([
                    PandoraPay.network.subscribeNetwork( publicKey, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT ),
                    PandoraPay.network.subscribeNetwork( publicKey, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT_TRANSACTIONS ),
                ])

                commit('setSubscribedAccountStatus', {publicKey, status: true})

                resolve( await dispatch('_downloadAccount', {publicKey, forced} ) )

            }catch(err){
                console.error("subscribeAccount", err)
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

    async resubscribeAccounts({state, dispatch, commit} ){

        const promises = []
        for (const publicKey in state.subscribed)
            promises.push( dispatch('subscribeAccount', {publicKey: publicKey, forced: true }) )

        return Promise.all(promises)
    },

    async accountUpdateNotification( {state, dispatch, commit, getters}, {publicKey, type, data, extraInfo }){

        let account = state.list[publicKey] || {}

        if (type === PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT){

            const {asset, index} = extraInfo

            if (data === null ){

                if (account.accounts ) {
                    for (let i = 0; i < account.accounts.length; i++)
                        if (account.accounts[i].asset === asset) {
                            account.accounts.splice(i, 1) //remove
                            break
                        }
                    if (!account.accounts.length)
                        delete account.accounts
                }

            } else {

                if (!account.accounts)
                    account.accounts = []

                let found = false
                for (let i = 0; i < account.accounts.length; i++)
                    if (account.accounts[i].asset === asset) {
                        account.accounts[i] = {...data, asset, index }
                        found = true
                        break
                    }

                if (!found){
                    account.accounts.push({...data, asset, index })
                }

            }

        } else if (type === PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_PLAIN_ACCOUNT){

            if (data === null )
                delete account.plainAccount
            else
                account.plainAccount = {...data, index: extraInfo.index }

        }else if (type === PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_REGISTRATION){
            if (data === null ) {
                delete account.registration
            }else
                account.registration = {...data, index: extraInfo.index }
        }

        if (!Object.keys(account).length)
            account = null

        if (account && account.accounts)
            for (let i = 0; i < account.accounts.length; i++)
                await dispatch('getAssetByHash', account.accounts[i].asset )

        commit('setAccount', {publicKey, account})

    },

}
