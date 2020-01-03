import getters from "./blockchain-getters"
import mutations from "./blockchain-mutations"

export default {

    state: {

        start: 0,
        end: 0,
        hash: '',
        prevHash: '',
        prevKernelHash: '',
        chainWork: '',

        status: '',

        blocks: {},
        blocksByHash: {},

        blocksInfo: {},

    },

    mutations,
    getters,

}