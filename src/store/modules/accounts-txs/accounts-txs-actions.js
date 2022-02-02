import consts from "consts/consts";
import Decimal from "decimal.js"

const promises = {
    accountsTxs: {},
}


export default {

    async downloadAccountTxs({state, dispatch, commit}, {publicKey, next, view = false, } ){

        let starting, ending

        if (promises.accountsTxs[publicKey]) return promises.accountsTxs[publicKey];
        return promises.accountsTxs[publicKey] = new Promise( async (resolve, reject) => {
            try{
                const out = await PandoraPay.network.getNetworkAccountTxs( MyTextEncode( JSONStringify( {
                    publicKey,
                    next: view ? next : new Decimal(2).pow(64).minus(1)
                } ) ) );
                const accountTxs = JSONParse(MyTextDecode( out ) )

                if (!accountTxs || !accountTxs.count)
                    return resolve(accountTxs)

                console.log("next", next ? next.toString() : null, accountTxs )

                if (!view){
                    starting = Decimal.max(0, accountTxs.count.minus( consts.addressTxsPagination ) )
                    ending = accountTxs.count
                }else {
                    starting = Decimal.max(0, next.minus( consts.addressTxsPagination ) )
                    ending = next
                }

                console.log("txs starting end", starting.toString(), ending.toString(), accountTxs )

                if (view) {
                    const viewStart = Decimal.ceil( next.div( consts.addressTxsPagination )).minus(1).mul( consts.addressTxsPagination )
                    const viewEnd = viewStart.plus( consts.addressTxsPagination )
                    commit('setAccountTxsViewPosition', {publicKey, data: { starting: viewStart, ending: viewEnd}  })
                } else {
                    commit('setAccountTxsViewPosition', {publicKey, data: null })
                }

                commit('setAccountTxs', { publicKey, starting, accountTxs })

                resolve(accountTxs)
            }catch(err){
                console.error(err)
                reject(err)
            }finally{
                delete promises.accountsTxs[publicKey];
            }
        })
    },

    async accountTxUpdateNotification( {state, dispatch, commit, getters}, {publicKey, txHash, extraInfo }){

        if (getters.walletContains(publicKey)){

            if (extraInfo.blockchain){

                if (extraInfo.blockchain.inserted)
                    dispatch('addToast', {
                        type: 'success',
                        title: `Received a new transaction`,
                        text: `Your address has received a transaction ${txHash}`,
                    } )
                else
                    dispatch('addToast', {
                        type: 'warning',
                        title: `A transaction was removed from blockchain`,
                        text: `Your address got a transaction removed ${txHash}`,
                    } )


            } else if (extraInfo.mempool) {

                if (extraInfo.mempool.inserted)
                    dispatch('addToast', {
                        type: 'info',
                        title: `A pending transaction`,
                        text: `There is a pending transaction ${txHash}`,
                    } )
                else
                    dispatch('addToast', {
                        type: 'warning',
                        title: `A transaction was removed from the mempool`,
                        text: `A pending transaction was removed from the mempool ${txHash}`,
                    } )

            } else throw "Invalid extraInfo"

        }

        await dispatch('txNotification', { txHash, extraInfo })
        await dispatch('accountPendingTransactionsTxUpdateNotification', { publicKey, txHash, extraInfo } )

        commit('addAccountTxUpdateNotification', { publicKey, txHash, extraInfo } )

    }

}