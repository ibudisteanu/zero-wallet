import getters from "./blockchain-getters"
import mutations from "./blockchain-mutations"

export default {

    state: {

        genesisTimestamp: 0,

        end: 0,

        hash: '',
        prevHash: '',
        prevKernelHash: '',
        assets: 0,
        transactions: 0,

        status: '',

        syncPromise: null,
        syncPromiseResolve: null,
        syncPromiseResolved: false,

    },

    mutations,
    getters,

}
