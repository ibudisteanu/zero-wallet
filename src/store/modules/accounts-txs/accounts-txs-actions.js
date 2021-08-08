import consts from "consts/consts";

const promises = {
    accountsTxs: {},
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

    async accountTxUpdateNotification( {state, dispatch, commit, getters}, {publicKeyHash, txHash, extraInfo }){

        if (getters.walletContains(publicKeyHash)){

            if (extraInfo.blockchain){

                if (extraInfo.blockchain.inserted){

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


            } else if (extraInfo.mempool) {

                if (extraInfo.mempool.inserted){

                    dispatch('addToast', {
                        type: 'info',
                        title: `A pending transaction`,
                        text: `There is a pending transaction ${txHash}`,
                    } )

                    const tx = await dispatch('getTransactionByHash', txHash )
                    await PandoraPay.mempool.mempoolInsertTx(txHash, JSON.stringify(tx) )

                    return
                } else {

                    dispatch('addToast', {
                        type: 'warning',
                        title: `A transaction was removed from the mempool`,
                        text: `A pending transaction was removed from the mempool ${txHash}`,
                    } )

                    await PandoraPay.mempool.mempoolRemoveTx(txHash)

                }

            } else throw "Invalid extraInfo"

        }

        await dispatch('txNotification', { txHash, extraInfo })
        await dispatch('accountPendingTransactionsTxUpdateNotification', { publicKeyHash, txHash, extraInfo } )

        commit('addAccountTxUpdateNotification', { publicKeyHash, txHash, extraInfo } )

    }

}