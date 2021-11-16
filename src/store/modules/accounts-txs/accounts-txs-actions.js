import consts from "consts/consts";

const promises = {
    accountsTxs: {},
}


export default {

    async downloadAccountTxs({state, dispatch, commit}, {publicKey, next, view = false, } ){

        let starting, ending

        if (promises.accountsTxs[publicKey]) return promises.accountsTxs[publicKey];
        return promises.accountsTxs[publicKey] = new Promise( async (resolve, reject) => {
            try{
                const out = await PandoraPay.network.getNetworkAccountTxs( MyTextEncode( JSON.stringify( {publicKey, next: (next === undefined) ? Number.MAX_SAFE_INTEGER : next } ) ) );
                const accountTxs = JSON.parse(MyTextDecode( out) )

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

                if (extraInfo.blockchain.inserted){

                    dispatch('addToast', {
                        type: 'success',
                        title: `Received a new transaction`,
                        text: `Your address has received a transaction ${txHash}`,
                    } )

                } else {

                    dispatch('addToast', {
                        type: 'warning',
                        title: `A transaction was removed from blockchain`,
                        text: `Your address got a transaction removed ${txHash}`,
                    } )

                }


            } else if (extraInfo.mempool) {

                if (extraInfo.mempool.inserted){

                    dispatch('addToast', {
                        type: 'info',
                        title: `A pending transaction`,
                        text: `There is a pending transaction ${txHash}`,
                    } )


                } else {

                    dispatch('addToast', {
                        type: 'warning',
                        title: `A transaction was removed from the mempool`,
                        text: `A pending transaction was removed from the mempool ${txHash}`,
                    } )

                }

            } else throw "Invalid extraInfo"

        }

        await dispatch('txNotification', { txHash, extraInfo })
        await dispatch('accountPendingTransactionsTxUpdateNotification', { publicKey, txHash, extraInfo } )

        commit('addAccountTxUpdateNotification', { publicKey, txHash, extraInfo } )

    }

}