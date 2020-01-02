import VueRouter from "vue-router"
import Vue from "vue";

import WalletPage from "src/pages/wallet/wallet.page"
import LoginPage from "src/pages/login/login.page"
import SendMoneyPage from "src/pages/send-money/send-money.page"
import ReceiveMoneyPage from "src/pages/receive-page/receive-money.page"
import AccountInfoPage from "src/pages/account-info/account-info.page"
import SetPasswordPage from "src/pages/encryption/set-password.page"
import RemovePasswordPage from "src/pages/encryption/remove-password.page"
import BlockchainExplorerPage from "src/pages/explorer/blockchain-explorer.page"

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

    {path: '/send-money', component: SendMoneyPage, beforeEnter: guardDecrypted, },
    {path: '/send', component: SendMoneyPage, beforeEnter: guardDecrypted },
    {path: '/receive-money', component: ReceiveMoneyPage, beforeEnter: guardDecrypted },
    {path: '/receive', component: ReceiveMoneyPage, beforeEnter: guardDecrypted },
    {path: '/account', component: AccountInfoPage, beforeEnter: guardDecrypted },
    {path: '/set-password', component: SetPasswordPage , beforeEnter: guardDecrypted},
    {path: '/remove-password', component: RemovePasswordPage, beforeEnter: guardDecrypted },
    {path: '/explorer', component: BlockchainExplorerPage },
    {path: '/login', component: LoginPage, beforeEnter: guardLogin },

    {path: '/', component: WalletPage, beforeEnter: guardDecrypted },

];

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
});

export default router;