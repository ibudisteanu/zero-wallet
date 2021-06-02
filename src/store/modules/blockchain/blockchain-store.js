import getters from "./blockchain-getters"
import mutations from "./blockchain-mutations"

export default {

    state: {

        genesisTimestamp: 0,

        end: 0,
        next: null,

        hash: '',
        prevHash: '',
        prevKernelHash: '',

        status: '',

        blocks: {},
        blocksByHash: {},

        blocksInfo: {},

    },

    mutations,
    getters,

}
