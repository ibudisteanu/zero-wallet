import mutations from "./assets-info-mutations"
import actions from "./assets-info-actions"
import getters from "./assets-info-getters";

export default{

    state: {
        listByHeight: {},

        viewPosition: null,
        allowDownload: false,
    },

    actions,
    mutations,
    getters,

}
