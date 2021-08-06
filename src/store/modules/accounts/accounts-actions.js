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
                    commit('setAccountTxsViewPosition', {publicKeyHash, data: { starting: viewStart, ending: viewEnd}  })
                } else {
                    commit('setAccountTxsViewPosition', {publicKeyHash, data: null })
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

                const result = await Promise.all([
                    PandoraPay.network.getNetworkAccount(publicKeyHash),
                    PandoraPay.network.getNetworkAccountMempool(publicKeyHash),
                ])

                const account = JSON.parse( result[0] )
                const accountTxsMempool = JSON.parse( result[1] )

                console.log(accountTxsMempool)

                if (account){
                    for (const balance of account.balances)
                        await dispatch('getTokenByHash', balance.token)

                    await dispatch('getTokenByHash', "")
                }

                await PandoraPay.store.storeAccount( publicKeyHash, result[0] )

                if (accountTxsMempool) {

                    const txs = await Promise.all( accountTxsMempool.map( txHash => dispatch('getTransactionByHash', txHash ) ))
                    txs.sort( (a,b) => ( (a.version === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ? a.nonce : -1) -
                                                 ( (b.version === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ? b.nonce : -1 ) ),

                    console.log(txs);

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

    async accountTxUpdateNotification( {state, dispatch, commit, getters}, {publicKeyHash, txHash, extraInfo }){

        if (getters.walletContains(publicKeyHash)){
            if (extraInfo.inserted){

                dispatch('addToast', {
                    type: 'success',
                    title: `Received a new transaction`,
                    text: `Your address has received a transaction ${txHash}`,
                } )

                await PandoraPay.mempool.mempoolRemoveTx(txHash)

            } else {

                dispatch('addToast', {
                    type: 'warning',
                    title: `A transaction was removed from blockchain`,
                    text: `Your address got a transaction removed ${txHash}`,
                } )

                const tx = await dispatch('getTransactionByHash', txHash )
                await PandoraPay.mempool.mempoolInsertTx(txHash, JSON.stringify(tx) )

            }
        }

        return commit('addAccountTxUpdateNotification', { publicKeyHash, txHash, extraInfo } )
    }

}
