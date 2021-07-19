import consts from "consts/consts";

const promises = {
    accountsTxs: {},
    accounts: {},
    unsubscribed: {},
    subscribed: {},
}

export default {

    async accountTransactionsNotification( {state, dispatch, commit},  {publicKeyHash, txHash, extraInfo} ) {
        commit('accountTxUpdateNotification', {publicKeyHash, txHash, extraInfo})
    },

    async downloadAccountTxs({state, dispatch, commit}, {publicKeyHash, next, view = false, updateViewPosition = false } ){

        let starting, ending

        if (promises.accountsTxs[publicKeyHash]) return promises.accountsTxs[publicKeyHash];
        return promises.accountsTxs[publicKeyHash] = new Promise( async (resolve, reject) => {
            try{
                const out = await PandoraPay.network.getNetworkAccountTxs(publicKeyHash, (next === undefined) ? Number.MAX_SAFE_INTEGER : next  );
                const accountTxs = JSON.parse(out)

                console.log("next", next, updateViewPosition, accountTxs)

                if (accountTxs)
                    if (next === undefined){
                        starting = Math.max(0, accountTxs.count - consts.addressTxsPagination )
                        ending = accountTxs.count
                    }else {
                        starting = next - consts.addressTxsPagination
                        ending = next
                    }

                if (view)
                    commit('setAccountTxsViewPosition', { publicKeyHash, starting,  ending, update: updateViewPosition })

                commit('setAccountTxs', { publicKeyHash, starting, accountTxs })

                resolve(accountTxs)
            }catch(err){
                reject(err)
            }finally{
                delete promises.accountsTxs[publicKeyHash];
            }
        })
    },

    async _downloadAccount({state, dispatch, commit},publicKeyHash){

        if (promises.accounts[publicKeyHash]) return promises.accounts[publicKeyHash]

        if (promises.accounts[publicKeyHash]) return promises.accounts[publicKeyHash];
        return promises.accounts[publicKeyHash] = new Promise( async (resolve, reject) => {
            try{
                const out = await PandoraPay.network.getNetworkAccount(publicKeyHash);
                const account = JSON.parse(out)

                if (account){
                    for (const balance of account.balances)
                        await dispatch('getTokenInfoByHash', balance.token)

                    await dispatch('getTokenInfoByHash', "")
                }

                commit('setAccount', { publicKeyHash, account })

                resolve(account)
            }catch(err){
                reject(err)
            }finally{
                delete promises.accounts[publicKeyHash];
            }
        })
    },

    async unsubscribeAccount({state, dispatch, commit}, publicKeyHash){

        if (!state.subscribed[publicKeyHash])
            return false

        if (promises.unsubscribed[publicKeyHash]) return promises.unsubscribed[publicKeyHash]
        return promises.unsubscribed[publicKeyHash] = new Promise( async(resolve, reject)=>{
            try{

                await Promise.all([
                    PandoraPay.network.unsubscribeNetwork( publicKeyHash, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT ),
                    PandoraPay.network.unsubscribeNetwork( publicKeyHash, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_TRANSACTIONS)
                ]);

                commit('setSubscribedAccountStatus', {publicKeyHash, status: false})

                resolve(true)
            }catch(err){
                reject(err)
            }finally{
                delete promises.unsubscribed[publicKeyHash]
            }
        })

    },

    async subscribeAccount({state, dispatch, commit}, publicKeyHash){

        if (state.subscribed[publicKeyHash])
            return dispatch('_downloadAccount', publicKeyHash)

        if (promises.subscribed[publicKeyHash]) return promises.subscribed[publicKeyHash];
        return promises.subscribed[publicKeyHash] = new Promise( async (resolve, reject) => {

            try{

                await Promise.all([
                    PandoraPay.network.subscribeNetwork( publicKeyHash, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT ),
                    PandoraPay.network.subscribeNetwork( publicKeyHash, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_TRANSACTIONS ),
                ])

                resolve( await dispatch('_downloadAccount', publicKeyHash) )

                commit('setSubscribedAccountStatus', {publicKeyHash, status: true})

            }catch(err){
                reject(err)
            }finally{
                delete promises.subscribed[publicKeyHash];
            }

        })
    },

}
