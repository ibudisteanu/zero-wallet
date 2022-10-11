import {createRouter, createWebHistory} from "vue-router"
import LoginPage from "src/pages/login/login.page"
import PrivateSendPage from "src/pages/send/private/private-send.page"
import PrivateConditionalPaymentPage from "../pages/send/private/private-conditional-payment-page";
import SimpleTxResolutionConditionalPaymentPage from "../pages/send/public/simple-tx-resolution-conditional-payment-page"
import SignResolutionConditionalPaymentPage from "src/pages/send/public/sign-resolution-conditional-payment-page";
import ImportLinkPage from "../pages/other/import-link-page";
import ReceivePage from "src/pages/receive/receive.page"
import WalletPage from "src/pages/wallet/wallet.page"
import AddressPage from "src/pages/address/address.page"
import SetPasswordPage from "src/pages/encryption/set-password.page"
import RemovePasswordPage from "src/pages/encryption/remove-password.page"
import BlockchainExplorerPage from "src/pages/explorer/blockchain-explorer.page"
import BlockExplorerPage from "src/pages/explorer/block-explorer.page"
import TransactionExplorerPage from "src/pages/explorer/transaction-explorer.page"
import AssetExplorerPage from "src/pages/explorer/asset-explorer.page"
import MempoolExplorerPage from "src/pages/explorer/mempool-explorer.page"
import AssetsPage from "src/pages/assets/assets.page"
import SettingsPage from "src/pages/settings/settings.page"
import NotFoundPage from "src/pages/not-found/not-found.page"

import store from "./../store/store"

const guardDecrypted = (to, from, next) => {

//    if (store.state.wallet.initialized && !store.state.wallet.loaded ) return next('/login');
    next();

};

const guardLogin = (to, from, next) =>{

//    if (store.state.wallet.initialized && store.state.wallet.loaded ) return next('/');
    next();

};

const routes = [

    {path: '/txs/private/send', component: PrivateSendPage, beforeEnter: guardDecrypted },

    {path: '/advanced-txs/private/conditional-payment', component: PrivateConditionalPaymentPage, beforeEnter: guardDecrypted },
    {path: '/advanced-txs/public/resolution-conditional-payment', component: SimpleTxResolutionConditionalPaymentPage, beforeEnter: guardDecrypted},
    {path: '/advanced-txs/sign-resolution-conditional-payment', component: SignResolutionConditionalPaymentPage },
    {path: '/advanced-txs/import-link', component: ImportLinkPage },

    {path: '/receive', component: ReceivePage, beforeEnter: guardDecrypted },
    {path: '/wallet', component: WalletPage, beforeEnter: guardDecrypted },

    {path: '/set-password', component: SetPasswordPage , beforeEnter: guardDecrypted},
    {path: '/remove-password', component: RemovePasswordPage, beforeEnter: guardDecrypted },

    {path: '/explorer/block/:query', component: BlockExplorerPage },
    {path: '/explorer/tx/:query', component: TransactionExplorerPage},

    {path: '/explorer/assets', component: AssetsPage},
    {path: '/explorer/assets/:page', component: AssetsPage},
    {path: '/explorer/asset/:hash', component: AssetExplorerPage },

    {path: '/explorer/mempool', component: MempoolExplorerPage },
    {path: '/explorer/mempool/:page', component: MempoolExplorerPage },

    {path: '/explorer', component: BlockchainExplorerPage },
    {path: '/explorer/:page', component: BlockchainExplorerPage },

    {path: '/settings', component: SettingsPage },

    {path: '/login', component: LoginPage, beforeEnter: guardLogin },

    {path: '/', component: AddressPage, beforeEnter: guardDecrypted },
    {path: '/index.html', component: AddressPage, beforeEnter: guardDecrypted },

    {path: '/address/:address', component: AddressPage, beforeEnter: guardDecrypted  },
    {path: '/address/:address/:page', component: AddressPage, beforeEnter: guardDecrypted  },

    { path: '/:catchAll(.*)', name: 'not-found', component: NotFoundPage,}

];

const router = createRouter({
    base: PandoraPayWalletOptions.router.base || '/',
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
        if (to.hash && to.hash.length > 1) return { selector: to.hash }
        else if (savedPosition) return savedPosition;
        else return { x: 0, y: 0 }
    },
    routes // short for `routes: routes`
});

export default router;
