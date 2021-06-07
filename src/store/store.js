import Vue from 'vue';
import Vuex from 'vuex';
import WalletStore from "./modules/wallet/wallet-store"
import AddressesStore from "./modules/addresses/addresses-store"
import BlockchainStore from "./modules/blockchain/blockchain-store"
import BlocksStore from "./modules/blocks/blocks-store"
import PageStore from "./modules/page/page-store"
import TransactionsStore from "./modules/transactions/transactions-store"
import TokensStore from "./modules/tokens/tokens-store"
import NetworkStore from "./modules/network/network-store"

Vue.use(Vuex);


const store = new Vuex.Store({

    modules: {

        wallet: WalletStore,

        blockchain: BlockchainStore,
        blocks: BlocksStore,
        page: PageStore,
        transactions: TransactionsStore,
        tokens: TokensStore,
        addresses: AddressesStore,

        network: NetworkStore,

    },


});

export default store;
