import VueRouter from "vue-router"
import Vue from "vue";

import WalletPage from "src/pages/wallet/wallet.page"
import LoginPage from "src/pages/login/login.page"
import SendTransparentTransferPage from "src/pages/send/transparent/send-transparent-transfer.page"
import SendTransparentDepositPage from "src/pages/send/transparent/send-transparent-deposit.page"
import ReceivePage from "src/pages/receive/receive.page"
import AccountInfoPage from "src/pages/account-info/account-info.page"
import DelegateStakePage from "src/pages/delegate-stake/delegate-stake.page.vue"
import SetPasswordPage from "src/pages/encryption/set-password.page"
import RemovePasswordPage from "src/pages/encryption/remove-password.page"
import BlockchainExplorerPage from "src/pages/explorer/blockchain-explorer.page"
import BlockExplorerPage from "src/pages/explorer/block-explorer.page"
import TransactionExplorerPage from "src/pages/explorer/transaction-explorer.page"
import TokenExplorerPage from "src/pages/explorer/token-explorer.page.vue"
import PendingTransactionsExplorerPage from "src/pages/explorer/pending-transactions-explorer.page"
import ExchangeBuyPage from "src/pages/exchange/buy/exchange-buy.page"
import ExchangeBuyAddOfferPage from "src/pages/exchange/buy/exchange-buy-add-offer.page"
import ExchangeSellAddOfferPage from "src/pages/exchange/sell/exchange-sell-add-offer.page"
import ExchangeSellPage from "src/pages/exchange/sell/exchange-sell.page"
import ExchangePortfolioPage from "src/pages/exchange/portfolio/exchange-portfolio.page"
import TokensPage from "src/pages/tokens/tokens.page.vue"
import ChatPage from "src/pages/chat/chat.page"
import ChatConversationPage from "src/pages/chat/chat-conversation.page"
import ChatConversationStartPage from "src/pages/chat/chat-conversation-start.page"
import ShopPage from "src/pages/shop/shop.page"
import NotFoundPage from "src/pages/not-found/not-found.page"

Vue.use(VueRouter);

import store from "./../store/store"

const guardDecrypted = (to, from, next) => {

    if (store.state.wallet.loaded && !store.state.wallet.loggedIn ) return next('/login');

    next();

};

const guardLogin = (to, from, next) =>{

    if (store.state.wallet.loaded && store.state.wallet.loggedIn ) return next('/');

    next();
};

const routes = [

    {path: '/send/transparent/transfer', component: SendTransparentTransferPage, beforeEnter: guardDecrypted },
    {path: '/send/transparent/deposit', component: SendTransparentDepositPage, beforeEnter: guardDecrypted },

    {path: '/receive', component: ReceivePage, beforeEnter: guardDecrypted },
    {path: '/account', component: AccountInfoPage, beforeEnter: guardDecrypted },
    {path: '/set-password', component: SetPasswordPage , beforeEnter: guardDecrypted},
    {path: '/remove-password', component: RemovePasswordPage, beforeEnter: guardDecrypted },

    {path: '/explorer/block/height/:height', component: BlockExplorerPage },
    {path: '/explorer/block/hash/:hash', component: BlockExplorerPage },
    {path: '/explorer/tx/hash/:hash', component: TransactionExplorerPage },
    {path: '/explorer', component: BlockchainExplorerPage },
    {path: '/explorer/pending-transactions', component: PendingTransactionsExplorerPage },

    {path: '/exchange/buy', component: ExchangeBuyPage },
    {path: '/exchange/buy/add-offer', component: ExchangeBuyAddOfferPage },

    {path: '/exchange/sell', component: ExchangeSellPage },
    {path: '/exchange/sell/add-offer', component: ExchangeSellAddOfferPage },

    {path: '/tokens', component: TokensPage},
    {path: '/tokens/token/:hash', component: TokenExplorerPage },

    {path: '/exchange/portfolio', component: ExchangePortfolioPage },

    {path: '/delegate-stake', component: DelegateStakePage },

    {path: '/shop', component: ShopPage },

    {path: '/chat', component: ChatPage },

    {path: '/chat/conversation/start', component: ChatConversationStartPage },
    {path: '/chat/conversation/:publicKey', component: ChatConversationPage },

    {path: '/login', component: LoginPage, beforeEnter: guardLogin },

    {path: '/', component: WalletPage, beforeEnter: guardDecrypted },

    { path: '*', name: 'not-found', component: NotFoundPage,}

];

const router = new VueRouter({
    base: window.PandoraPayWallet ? window.PandoraPayWallet.base : '',
    mode: (window.PandoraPayWallet ? window.PandoraPayWallet.mode : '') || 'history',
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return { selector: to.hash }
        } else if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 }
        }
    },
    routes // short for `routes: routes`
});

export default router;
