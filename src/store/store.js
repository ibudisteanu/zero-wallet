import Vue from 'vue';
import Vuex from 'vuex';
import WalletStore from "./modules/wallet/wallet-store"
import BlockchainStore from "./modules/blockchain/blockchain-store"
import PageStore from "./modules/page/page-store"
import TransactionsStore from "./modules/transactions/transactions-store"

Vue.use(Vuex);


const store = new Vuex.Store({

    modules: {

        wallet: WalletStore,
        blockchain: BlockchainStore,
        page: PageStore,
        transactions: TransactionsStore,

    },


});

export default store;