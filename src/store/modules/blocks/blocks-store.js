import getters from "./blocks-getters"
import mutations from "./blocks-mutations"

export default {

    state: {
        blocks: {},
        blocksByHash: {},

        blocksInfo: {},
    },

    mutations,
    getters,
}
