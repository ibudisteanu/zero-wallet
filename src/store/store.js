import Vue from 'vue/dist/vue.min';
import Vuex from 'vuex/dist/vuex.min';

Vue.use(Vuex);

const init = {
    loaded: false,
    loggedIn: false,

    encrypted: null,
    version: null,

    addresses: {},
    mainAddress: null,


    isLoading: false,
};

const store = new Vuex.Store({

    state: Object.assign({}, init ),

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
        setLoaded(context, value){
            context.loaded = value;
        },

        setIsLoading(context, value){
            context.isLoading = value;
        },

        clear(context){

            context.loaded = false;
            context.loggedIn = false;
            context.encrypted = null;
            context.version = null;
            context.addresses = {};
            context.mainAddress = null;

            context.isLoading = false;

            localStorage.removeItem('mainAddress');
        }


    },

    actions:{



    },

});

export default store;