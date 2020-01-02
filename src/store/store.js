import Vue from 'vue/dist/vue.min';
import Vuex from 'vuex/dist/vuex.min';
import WalletStore from "./modules/wallet/wallet-store"

Vue.use(Vuex);


const store = new Vuex.Store({

    modules: {

        wallet: WalletStore,

    },




});

export default store;