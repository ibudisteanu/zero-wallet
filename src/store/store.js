import Vue from 'vue';
import Vuex from 'vuex';
import WalletStore from "./modules/wallet/wallet-store"
import AddressesStore from "./modules/addresses/addresses-store"
import AccountsStore from "./modules/accounts/accounts-store"
import AccountsTxsStore from "./modules/accounts-txs/accounts-txs-store"
import AccountsPendingTxsStore from "./modules/accounts-pending-txs/accounts-pending-txs-store"
import BlockchainStore from "./modules/blockchain/blockchain-store"
import BlocksStore from "./modules/blocks/blocks-store"
import BlocksInfoStore from "./modules/blocks-info/blocks-info-store"
import PageStore from "./modules/page/page-store"
import TransactionsStore from "./modules/transactions/transactions-store"
import TokensStore from "./modules/tokens/tokens-store"
import TokensInfoStore from "./modules/tokens-info/tokens-info-store"
import NetworkStore from "./modules/network/network-store"
import MemPoolStore from "./modules/mem-pool/mem-pool-store"
import FaucetStore from "./modules/faucet/faucet-store"
import ToastsStore from "./modules/toasts/toasts-store"

Vue.use(Vuex);


const store = new Vuex.Store({

    modules: {

        wallet: WalletStore,

        blockchain: BlockchainStore,
        blocks: BlocksStore,
        blocksInfo: BlocksInfoStore,
        page: PageStore,
        transactions: TransactionsStore,
        tokens: TokensStore,
        tokensInfo: TokensInfoStore,
        addresses: AddressesStore,
        accounts: AccountsStore,
        accountsTxs: AccountsTxsStore,
        accountsPendingTxs: AccountsPendingTxsStore,
        mempool: MemPoolStore,
        faucet: FaucetStore,
        toasts: ToastsStore,

        network: NetworkStore,
    },


});

export default store;
