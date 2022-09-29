import getters from "./blockchain-getters"
import mutations from "./blockchain-mutations"
import Decimal from 'decimal.js';

export default {

    state: {

        genesisTimestamp: new Decimal(0),

        end: new Decimal(0),

        hash: '',
        prevHash: '',
        prevKernelHash: '',
        assets: new Decimal(0),
        transactions: new Decimal(0),

        status: '',

        syncPromise: null,
        syncPromiseResolve: null,
        syncPromiseResolved: false,

    },

    mutations,
    getters,

}
