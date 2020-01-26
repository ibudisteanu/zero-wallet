import mutations from "./exchange-mutations"

export default {

    state: {

        buy:{
            offers: {},
            next: null,
            count: null,
        },

        sell:{
            offers: {},
            next: null,
            count: null,
        },

        list: {},

    },

    mutations,

}