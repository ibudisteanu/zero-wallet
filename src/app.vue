<template>

    <div>

        <div v-if="!error">

            <!-- component matched by the route will render here -->
            <router-view></router-view>

        </div>

        <div v-if="error">
            {{error}}
        </div>

        <notifications position="bottom left" />

    </div>

</template>

<script>

import Consensus from "./consensus/consensus"
import Chat from "./chat/chat"
const {WalletAddressTypeEnum} = global.blockchain.blockchain.wallet;

export default {

    components: {  },

    data(){
        return {
            error: '',

        }
    },

    computed:{

        pageActive(){
            return this.$store.state.page.pageActive;
        },
        loggedIn(){
            return this.$store.state.wallet.loggedIn;
        },

    },

    async mounted(){

        if (typeof window === "undefined") return;

        PandoraPay._scope.argvBrowser = ["--testnet:activated", "true", '--testnet:createNewTestNet', "true"];

        PandoraPay.events.on("wallet/loaded", wallet => this.readWallet() );

        PandoraPay.events.on("wallet/address-removed", walletAddress => this.readAddresses() );

        PandoraPay.events.on("wallet/address-pushed", walletAddress => this.readAddresses() );

        PandoraPay.events.on("wallet/loaded-error", err => {
            this.error = err;
        });

        PandoraPay.events.on("wallet/encrypted",async encrypted => this.$store.commit('setEncrypted', encrypted ) );

        PandoraPay.events.on("wallet/loggedIn", loggedIn => {

            if (loggedIn)
                return this.readWallet();
            else {
                this.clearWallet();
                return this.readWallet();
            }

        } );

        await PandoraPay.start();


        Consensus.on("consensus/blockchain-info-updated", info => this.$store.commit('setBlockchainInfo', info) );

        Consensus.on("consensus/blockchain-info-genesis-updated", info => this.$store.commit('setBlockchainInfoGenesis', info) );

        Consensus.on("consensus/block-info-downloaded", data => this.$store.commit('setBlockchainBlockInfo', data) );

        Consensus.on("consensus/status-update", status =>  this.$store.commit('setConsensusStatus', status) );

        Consensus.on("consensus/block-downloaded", data => this.$store.commit('setBlockchainBlock', data ) );

        Consensus.on("consensus/block-deleted", data => this.$store.commit('deleteBlockchainBlock', data ) );

        Consensus.on("consensus/account-update", data => this.$store.commit('setAddressUpdate', data ) );

        Consensus.on("consensus/account-update-tx-count", data => this.$store.commit('setAddressTxCounts', data ) );

        Consensus.on("consensus/account-update-txs", data => this.$store.commit('setAddressTxs', data ) );

        Consensus.on("consensus/account-update-pending-txs", data => this.$store.commit('setAddressPendingTxs', data ) );

        Consensus.on("consensus/pending-transactions", data => this.$store.commit('setPendingTransactions', data ) );

        Consensus.on("consensus/pending-transactions-count", data => this.$store.commit('setPendingTransactionsCount', data ) );

        Consensus.on("consensus/tx-downloaded", data => this.$store.commit('setTransactions', data  ) );

        Consensus.on("consensus/tx-deleted", data => this.$store.commit('deleteTransactions', data ) );

        Consensus.on("consensus/tokens-ids", data => this.$store.commit('setTokensIds', data  ) );

        Consensus.on("consensus/tokens-count", data => this.$store.commit('setTokensCount', data  ) );

        Consensus.on("consensus/tokens-downloaded", data => this.$store.commit('setTokens', data  ) );

        Consensus.on("consensus/tokens-deleted", data => this.$store.commit('deleteTokens', data ) );

        Consensus.on("consensus/exchange-offers-count", data => this.$store.commit('setExchangeOffersCount', data ) );

        Consensus.on("consensus/exchange-offers-ids", data => this.$store.commit('setExchangeOffersIds', data ) );

        Consensus.on("consensus/exchange-offers", data => this.$store.commit('setExchangeOffers', data ) );


        Chat.on("encrypted-chat/chat-info-updated", info => this.$store.commit('setChatInfo', info));

        Chat.on("encrypted-chat/status-update", status =>  this.$store.commit('setChatStatus', status) );

        Chat.on("encrypted-chat/conversation-messages-count-update", data => this.$store.commit('setChatConversationMessagesCount', data));

        Chat.on("encrypted-chat/conversation-messages-ids-update", data => this.$store.commit('setChatConversationMessagesIds', data));

        Chat.on("encrypted-chat/message-downloaded", data => this.$store.commit('setChatEncryptedMessage', data));

        Chat.on("encrypted-chat/conversations-count-update", data => this.$store.commit('setChatConversationsCount', data));

        Chat.on("encrypted-chat/conversations-update", data => this.$store.commit('setChatConversations', data));

        Chat.on("encrypted-chat/set-captcha", data => this.$store.commit('setCaptcha', data));
        Chat.on("encrypted-chat/set-captcha-loading", data => this.$store.commit('setCaptchaLoading', data));

        await Consensus.start();

        await Chat.start();

    },

    methods:{

        readWallet(){

            const wallet = PandoraPay.wallet;

            this.$store.commit('setEncrypted', wallet.encrypted );
            this.$store.commit('setVersion', wallet.version );

            const loggedIn = wallet.isLoggedIn();
            this.$store.commit('setLoggedIn', loggedIn );

            this.readAddresses();

            const route = this.$router.currentRoute.path;
            if (!loggedIn && route.indexOf('/explorer') === -1 ) this.$router.push('/login');
            if (loggedIn && route.indexOf('/login') >= 0) this.$router.push('/');

            this.$store.commit('setLoaded', true);


        },

        clearWallet(){
            return this.$store.commit('walletClear');
        },

        readAddresses(){

            const wallet = PandoraPay.wallet;

            if ( !wallet.isLoggedIn() ) return;

            let minerAddress = localStorage.getItem('mainAddress') || null;

            let firstAddress;
            const addresses = {};
            for (let i=0; i < wallet.addresses.length; i++ ){

                const type = wallet.addresses[i].type;

                const publicAddress =  wallet.addresses[i].keys.decryptPublicAddress();
                const publicKey = wallet.addresses[i].keys.decryptPublicKey();

                const mnemonicSequenceIndex =  wallet.addresses[i].decryptMonemonicSequenceIndex();
                const mnemonicSequenceIndexValue = Number.parseInt( mnemonicSequenceIndex.toString("hex"), 16);

                const address = publicAddress.calculateAddress();

                addresses[address] = {
                    address,
                    type: type,
                    publicKey: publicKey.toString("hex"),
                    name: wallet.addresses[i].name,
                    mnemonicSequenceIndex: mnemonicSequenceIndexValue ,
                    identicon: publicAddress.identiconImg(),
                    loaded: false,
                };

                if (type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT){ //transparent
                    addresses[address].publicKeyHash = publicAddress.publicKeyHash.toString("hex");
                }else
                if (type === WalletAddressTypeEnum.WALLET_ADDRESS_ZETHER){ //zether
                    const registration = wallet.addresses[i].keys.decryptRegistration();
                    addresses[address].registration = registration.c.toString('hex')+registration.s.toString('hex');

                    const zetherPublicAddress =  wallet.addresses[i].keys.decryptPublicAddress(true);
                    addresses[address].addressRegistration = zetherPublicAddress.calculateAddress();

                }

                if (i === 0)
                    firstAddress = address;
            }

            //localstorage
            if (minerAddress && addresses[minerAddress])
                this.$store.commit('setMainAddress', minerAddress);


            if (this.$store.state.wallet.mainAddress && !addresses[this.$store.state.wallet.mainAddress])
                this.$store.commit('setMainAddress', null );


            if (!this.$store.state.wallet.mainAddress && firstAddress )
                this.$store.commit('setMainAddress', firstAddress );

            //subscribe addresses
            Consensus.setAccounts( addresses, true );
            Chat.setAccounts( addresses, true );

            Consensus.getBlockchain();

            this.$store.commit('setAddresses', addresses );


        }

    },

}
</script>