const promises = {
    accounts: {},
    unsubscribed: {},
    subscribed: {},
}

export default {



    async _downloadAccount({state, dispatch, commit, getters},publicKeyHash){

        if (promises.accounts[publicKeyHash]) return promises.accounts[publicKeyHash]

        if (promises.accounts[publicKeyHash]) return promises.accounts[publicKeyHash];
        return promises.accounts[publicKeyHash] = new Promise( async (resolve, reject) => {
            try{

                const result = await Promise.all([
                    PandoraPay.network.getNetworkAccount(publicKeyHash),
                    PandoraPay.network.getNetworkAccountMempool(publicKeyHash),
                ])

                const account = JSON.parse( result[0] )
                const accountTxsMempool = JSON.parse( result[1] )

                if (account){
                    for (const balance of account.balances)
                        await dispatch('getTokenByHash', balance.token)

                    await dispatch('getTokenByHash', "")
                }

                await PandoraPay.store.storeAccount( publicKeyHash, result[0] )

                if (accountTxsMempool && getters.walletContains(publicKeyHash)) {
                    const txs = await Promise.all( accountTxsMempool.map( txHash => dispatch('getTransactionByHash', txHash ) ))

                    txs.sort( (a,b) => ( (a.version === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ? a.nonce : -1) -
                            ( (b.version === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ? b.nonce : -1 ) )
                    await Promise.all(txs.map( tx => PandoraPay.mempool.mempoolInsertTx( tx.hash, JSON.stringify(tx)) ))
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

                await PandoraPay.store.storeAccount( publicKeyHash, null )

                commit('removeAccount', { publicKeyHash })

                commit('setSubscribedAccountStatus', {publicKeyHash, status: false})

                resolve(true)
            }catch(err){
                reject(err)
            }finally{
                delete promises.unsubscribed[publicKeyHash]
            }
        })

    },

    async accountUpdateNotification( {state, dispatch, commit, getters}, {publicKeyHash, account }){
        await PandoraPay.store.storeAccount( publicKeyHash, null )
        commit('setAccount', {publicKeyHash, account})
    },

}
