import VueRouter from "vue-router"
import Vue from "vue";

import WalletPage from "src/pages/wallet/wallet.page"
import LoginPage from "src/pages/login/login.page"
import SendTransparentTransferPage from "src/pages/send/transparent/send-transparent-transfer.page"
import ReceivePage from "src/pages/receive/receive.page"
import AccountInfoPage from "src/pages/account-info/account-info.page"
import StakingPage from "src/pages/staking/staking.page"
import SetPasswordPage from "src/pages/encryption/set-password.page"
import RemovePasswordPage from "src/pages/encryption/remove-password.page"
import BlockchainExplorerPage from "src/pages/explorer/blockchain-explorer.page"
import BlockExplorerPage from "src/pages/explorer/block-explorer.page"
import TransactionExplorerPage from "src/pages/explorer/transaction-explorer.page"
import TokenExplorerPage from "src/pages/explorer/token-explorer.page.vue"
import PendingTransactionsExplorerPage from "src/pages/explorer/pending-transactions-explorer.page"
import TokensPage from "src/pages/tokens/tokens.page.vue"
import NotFoundPage from "src/pages/not-found/not-found.page"

import KadPage from "src/pages/kad/kad.page"

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

    {path: '/send', component: SendTransparentTransferPage, beforeEnter: guardDecrypted },

    {path: '/receive', component: ReceivePage, beforeEnter: guardDecrypted },
    {path: '/account', component: AccountInfoPage, beforeEnter: guardDecrypted },
    {path: '/set-password', component: SetPasswordPage , beforeEnter: guardDecrypted},
    {path: '/remove-password', component: RemovePasswordPage, beforeEnter: guardDecrypted },

    {path: '/explorer/block/height/:height', component: BlockExplorerPage },
    {path: '/explorer/block/hash/:hash', component: BlockExplorerPage },
    {path: '/explorer/tx/hash/:hash', component: TransactionExplorerPage },
    {path: '/explorer', component: BlockchainExplorerPage },
    {path: '/explorer/pending-transactions', component: PendingTransactionsExplorerPage },

    {path: '/tokens', component: TokensPage},
    {path: '/tokens/token/:hash', component: TokenExplorerPage },
    {path: '/tokens/token/', component: TokenExplorerPage },

    {path: '/staking', component: StakingPage },

    {path: '/kad', component: KadPage },

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
