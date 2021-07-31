import consts from "consts/consts";

const promises = {
    accountsTxs: {},
    accounts: {},
    unsubscribed: {},
    subscribed: {},
}

export default {

    async downloadAccountTxs({state, dispatch, commit}, {publicKeyHash, next, view = false, } ){

        let starting, ending

        if (promises.accountsTxs[publicKeyHash]) return promises.accountsTxs[publicKeyHash];
        return promises.accountsTxs[publicKeyHash] = new Promise( async (resolve, reject) => {
            try{
                const out = await PandoraPay.network.getNetworkAccountTxs(publicKeyHash, (next === undefined) ? Number.MAX_SAFE_INTEGER : next  );
                const accountTxs = JSON.parse(out)

                console.log("next", next, accountTxs)

                if (accountTxs)
                    if (next === undefined){
                        starting = Math.max(0, accountTxs.count - consts.addressTxsPagination )
                        ending = accountTxs.count
                    }else {
                        starting = next - consts.addressTxsPagination
                        ending = next
                    }

                if (view) {
                    const viewStart = (Math.ceil( next / consts.addressTxsPagination )-1) * consts.addressTxsPagination
                    const viewEnd = viewStart + consts.addressTxsPagination
                    commit('setAccountTxsViewPosition', {publicKeyHash, starting: viewStart, ending: viewEnd })
                }

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

    async subscribeAccount({state, dispatch, commit}, publicKeyHash){

        if (state.subscribed[publicKeyHash])
            return dispatch('_downloadAccount', publicKeyHash)

        if (promises.subscribed[publicKeyHash]) return promises.subscribed[publicKeyHash];
        return promises.subscribed[publicKeyHash] = new Promise( async (resolve, reject) => {

            try{

                await Promise.all([
                    PandoraPay.network.subscribeNetwork( publicKeyHash, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT ),
                    PandoraPay.network.subscribeNetwork( publicKeyHash, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT_TRANSACTIONS ),
                ])

                commit('setSubscribedAccountStatus', {publicKeyHash, status: true})

                resolve( await dispatch('_downloadAccount', publicKeyHash) )

            }catch(err){
                reject(err)
            }finally{
                delete promises.subscribed[publicKeyHash];
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
                    PandoraPay.network.unsubscribeNetwork( publicKeyHash, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT_TRANSACTIONS)
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


    async accountTxUpdateNotification( {state, dispatch, commit, getters}, {publicKeyHash, txHash, extraInfo }){

        if (getters.walletContains(publicKeyHash)){
            if (extraInfo.inserted){
                dispatch('addToast', {
                    type: 'success',
                    title: `Received a new transaction`,
                    text: `Your address has received a transaction <strong>${txHash}</strong>`,
                } )
            } else {
                dispatch('addToast', {
                    type: 'warning',
                    title: `A transaction was removed from blockchain`,
                    text: `Your address got a transaction removed <strong>${txHash}</strong>`,
                } )
            }
        }

        return commit('addAccountTxUpdateNotification', { publicKeyHash, txHash, extraInfo } )
    }

}
