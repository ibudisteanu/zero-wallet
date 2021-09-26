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

                const account = JSON.parse( result[0] )
                console.log("account", account )

                // if (account){
                //     for (const balance of account.balances)
                //         await dispatch('getTokenByHash', balance.token)
                //
                //     await dispatch('getTokenByHash', "")
                // }
                //
                // await PandoraPay.store.storeAccount( publicKey, token, result[0] )

                // await dispatch('processAccountPendingTransactions', {publicKey, list: JSON.parse(result[1]) })

                commit('setAccount', { publicKey, account })

                resolve(account)
            }catch(err){
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

    async accountUpdateNotification( {state, dispatch, commit, getters}, {publicKey, account }){
        await PandoraPay.store.storeAccount( publicKey, null )
        commit('setAccount', {publicKey, account})
    },

}
