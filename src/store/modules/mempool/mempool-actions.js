const promises = {}

export default {

    downloadMempool( {state, dispatch, commit}, page = 0 ){

        if (promises[page]) return promises[page]
        return promises[page] = new Promise(async (resolve, reject)=>{
            try{
                const data = await PandoraPay.network.getNetworkMempool( MyTextEncode(JSONStringify({
                    chainHash: (page === 0) ? "" : state.chainHash,
                    page: page,
                    count : 0,
                })) )
                if (!data) throw "Data was not received"

                const mempool = JSONParse(MyTextDecode(data))
                if (!mempool) throw "Mempool is invalid"

                commit('setMempool', {page, mempool })

                resolve(true)
            }catch(err){
                console.error(err)
                reject(err)
            }finally{
                delete promises[page]
            }
        })

    }

}
