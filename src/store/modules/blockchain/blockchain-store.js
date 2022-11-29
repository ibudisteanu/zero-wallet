import getters from "./blockchain-getters"
import mutations from "./blockchain-mutations"
import Decimal from 'decimal.js';

export default {

    state: {

        genesisTimestamp: Decimal_0,

        end: Decimal_0,

        hash: '',
        prevHash: '',
        prevKernelHash: '',
        assets: Decimal_0,
        transactions: Decimal_0,

        status: '',

        syncPromise: null,
        syncPromiseResolve: null,
        syncPromiseResolved: false,

    },

    mutations,
    getters,

}
