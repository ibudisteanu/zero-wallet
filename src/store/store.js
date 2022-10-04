import { createStore } from 'vuex';

import WalletStore from "./modules/wallet/wallet-store"
import PageSettings from "./modules/settings/settings-store"
import AddressesStore from "./modules/addresses/addresses-store"
import AccountsStore from "./modules/accounts/accounts-store"
import AccountsTxsStore from "./modules/accounts-txs/accounts-txs-store"
import AccountsPendingTxsStore from "./modules/accounts-pending-txs/accounts-pending-txs-store"
import BlockchainStore from "./modules/blockchain/blockchain-store"
import BlocksStore from "./modules/blocks/blocks-store"
import BlocksInfoStore from "./modules/blocks-info/blocks-info-store"
import PageStore from "./modules/page/page-store"
import TransactionsStore from "./modules/transactions/transactions-store"
import TransactionsInfoStore from "./modules/transactions-info/transactions-info-store"
import TransactionsPreviewStore from "./modules/transactions-preview/transactions-preview-store"
import AssetsStore from "./modules/assets/assets-store"
import AssetsInfoStore from "./modules/assets-info/assets-info-store"
import NetworkStore from "./modules/network/network-store"
import MempoolStore from "./modules/mempool/mempool-store"
import FaucetStore from "./modules/faucet/faucet-store"
import ToastsStore from "./modules/toasts/toasts-store"
import ValidatorsStore from "./modules/validators/validators-store";

export default createStore({

    modules: {

        page: PageStore,
        settings: PageSettings,

        wallet: WalletStore,

        blockchain: BlockchainStore,
        blocks: BlocksStore,
        blocksInfo: BlocksInfoStore,
        transactions: TransactionsStore,
        transactionsInfo: TransactionsInfoStore,
        transactionsPreview: TransactionsPreviewStore,
        assets: AssetsStore,
        assetsInfo: AssetsInfoStore,
        addresses: AddressesStore,
        accounts: AccountsStore,
        accountsTxs: AccountsTxsStore,
        accountsPendingTxs: AccountsPendingTxsStore,
        mempool: MempoolStore,
        faucet: FaucetStore,
        toasts: ToastsStore,

        network: NetworkStore,
        validators: ValidatorsStore,
    },


});

