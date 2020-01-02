import mutations from "./blockchain-mutations"
import getters from "./blockchain-getters"
import actions from "./blockchain-actions"

export default {

    state: {

        start: 0,
        end: 0,
        hash: '',
        prevHash: '',
        prevKernelHash: '',
        chainWork: '',

        status: '',

    },

    mutations,
    getters,
    actions,

}