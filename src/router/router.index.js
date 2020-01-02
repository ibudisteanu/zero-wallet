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


const routes = [

    {path: '/send-money', component: SendMoneyPage },
    {path: '/send', component: SendMoneyPage },
    {path: '/receive-money', component: ReceiveMoneyPage },
    {path: '/receive', component: ReceiveMoneyPage },
    {path: '/account', component: AccountInfoPage },
    {path: '/set-password', component: SetPasswordPage },
    {path: '/remove-password', component: RemovePasswordPage },
    {path: '/explorer', component: BlockchainExplorerPage },
    {path: '/login', component: LoginPage },

    {path: '/', component: WalletPage },

];

const router = new VueRouter({
    routes // short for `routes: routes`
});

export default router;