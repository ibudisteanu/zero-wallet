import Vue from 'vue';
import Vuex from 'vuex';
import WalletStore from "./modules/wallet/wallet-store"
import AddressesStore from "./modules/addresses/addresses-store"
import BlockchainStore from "./modules/blockchain/blockchain-store"
import PageStore from "./modules/page/page-store"
import TransactionsStore from "./modules/transactions/transactions-store"
import ExchangeStore from "./modules/exchange/exchange-store"

Vue.use(Vuex);


const store = new Vuex.Store({

    modules: {

        wallet: WalletStore,
        blockchain: BlockchainStore,
        page: PageStore,
        transactions: TransactionsStore,
        addresses: AddressesStore,
        exchange: ExchangeStore,

    },


});

export default store;