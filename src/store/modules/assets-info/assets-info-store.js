import mutations from "./assets-info-mutations"
import actions from "./assets-info-actions"
import getters from "./assets-info-getters";

export default{

    state: {
        list: {},

        listByHeight: {},
        next: null,
    },

    actions,
    mutations,
    getters,

}
