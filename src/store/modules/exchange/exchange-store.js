import mutations from "./exchange-mutations"

export default {

    state: {

        offers: {

            buy:{
                list: [],
                next: null,
                count: null,
            },

            sell:{
                list: [],
                next: null,
                count: null,
            },

        },

    },

    mutations,

}