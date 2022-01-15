import VueRouter from "vue-router"
import Vue from "vue";

import LoginPage from "src/pages/login/login.page"
import PrivateSendPage from "src/pages/send/private/private-send.page"
import PrivateDelegateStakePage from "src/pages/send/private/private-delegate-stake.page"
import PrivateClaim from "src/pages/send/private/private-claim.page"
import UnstakePage from "src/pages/send/staking/unstake.page"
import UpdateDelegatePage from "src/pages/send/staking/update-delegate.page"
import ReceivePage from "src/pages/receive/receive.page"
import WalletPage from "src/pages/wallet/wallet.page"
import AddressPage from "src/pages/address/address.page"
import StakesPage from "src/pages/staking/stakes.page"
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

import KadPage from "src/pages/kad/kad.page"

Vue.use(VueRouter);

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
    {path: '/txs/private/delegate', component: PrivateDelegateStakePage, beforeEnter: guardDecrypted },
    {path: '/txs/private/claim', component: PrivateClaim, beforeEnter: guardDecrypted },

    {path: '/txs/unstake', component: UnstakePage, beforeEnter: guardDecrypted },
    {path: '/txs/update-delegate', component: UpdateDelegatePage, beforeEnter: guardDecrypted },

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

    {path: '/stakes', component: StakesPage, beforeEnter: guardDecrypted },

    {path: '/kad', component: KadPage },

    {path: '/settings', component: SettingsPage },

    {path: '/login', component: LoginPage, beforeEnter: guardLogin },

    {path: '/', component: AddressPage, beforeEnter: guardDecrypted },
    {path: '/address/:address', component: AddressPage, beforeEnter: guardDecrypted  },
    {path: '/address/:address/:page', component: AddressPage, beforeEnter: guardDecrypted  },

    { path: '*', name: 'not-found', component: NotFoundPage,}

];

const router = new VueRouter({
    base: PandoraPayWalletOptions.router.base || '/',
    mode: PandoraPayWalletOptions.router.mode || 'history',
    scrollBehavior(to, from, savedPosition) {
        if (to.hash && to.hash.length > 1) return { selector: to.hash }
        else if (savedPosition) return savedPosition;
        else return { x: 0, y: 0 }
    },
    routes // short for `routes: routes`
});

export default router;
