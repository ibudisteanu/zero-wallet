import Vue from 'vue';
import Vuex from 'vuex';
import WalletStore from "./modules/wallet/wallet-store"
import AddressesStore from "./modules/addresses/addresses-store"
import BlockchainStore from "./modules/blockchain/blockchain-store"
import PageStore from "./modules/page/page-store"
import TransactionsStore from "./modules/transactions/transactions-store"
import TokensStore from "./modules/tokens/tokens-store"
import NetworkStore from "./modules/network/network-store"

import ChatStore from "./modules/chat/chat-store"
import ChatMessagesStore from "./modules/chat-messages/chat-messages-store"
import CaptchaStore from "./modules/captcha/captcha-store"

Vue.use(Vuex);


const store = new Vuex.Store({

    modules: {

        wallet: WalletStore,
        blockchain: BlockchainStore,
        page: PageStore,
        transactions: TransactionsStore,
        tokens: TokensStore,
        addresses: AddressesStore,

        chat: ChatStore,
        chatMessages: ChatMessagesStore,
        captcha: CaptchaStore,

        network: NetworkStore,

    },


});

export default store;