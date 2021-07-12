const promises = {}

export default {

    downloadMempool( {state, dispatch, commit}, start = 0 ){

        if (promises.mempool[start]) return promises.mempool[start]
        return promises.mempool[start] = new Promise(async (resolve, reject)=>{
            try{
                const data = await PandoraPay.network.getNetworkMempool(start)
                const mempool = JSON.parse(data)
                if (!mempool) throw "Mempool is invalid"

                const hasMore = ( start + mempool.hashes.length ) < mempool.count
                const next = ( start + mempool.hashes.length )

                commit('setMemPool', {start, mempool, hasMore, next })

                resolve(true)
            }catch(err){
                reject(err)
            }finally{
                delete (this._promises.mempool[start])
            }
        })

    }

}
