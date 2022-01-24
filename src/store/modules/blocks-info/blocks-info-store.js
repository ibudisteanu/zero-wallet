import actions from "./blocks-info-actions"
import getters from "./blocks-info-getters"
import mutations from "./blocks-info-mutations"

export default {

    state: {
        listByHeight: {},

        viewPosition: null,
        allowDownload: false,
    },

    actions,
    mutations,
    getters,
}
