import getters from "./blockchain-getters"
import mutations from "./blockchain-mutations"

export default {

    state: {

        genesisTimestamp: 0,

        end: 0,

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
