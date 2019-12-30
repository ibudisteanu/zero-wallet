import Vue from 'vue/dist/vue.min';
import Vuex from 'vuex/dist/vuex.min';

Vue.use(Vuex)

const store = new Vuex.Store({

    state: {
        loggedIn: false,

        encrypted: null,
        version: null,

        addresses: {},
        mainAddress: null,
    },

    mutations: {
        setLoggedIn( context, value){
            context.loggedIn = value;
        },

        setEncrypted( context, value ){
            context.encrypted = value;
        },
        setVersion( context, value){
            context.version = value;
        },
        setAddresses( context, value){
            context.addresses = value;
        },
        setMainAddress( context, value){
            context.mainAddress = value;
            localStorage.setItem('mainAddress', value);
        },
    },

    actions:{



    },

});

export default store;