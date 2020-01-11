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

        global.apacache._scope.argvBrowser = ["--blockchain:genesisTestNet:createNewTestNet", "true", "--settings:networkType", "1"];

        global.apacache.events.on("wallet/loaded", wallet => this.readWallet() );

        global.apacache.events.on("wallet/address-removed", walletAddress => this.readAddresses() );

        global.apacache.events.on("wallet/address-pushed", walletAddress => this.readAddresses() );

        global.apacache.events.on("wallet/loaded-error", err => {
            this.error = err;
        });

        global.apacache.events.on("wallet/encrypted",async encrypted => this.$store.commit('setEncrypted', encrypted ) );

        global.apacache.events.on("wallet/loggedIn", loggedIn => {

            if (loggedIn)
                return this.readWallet();
            else {
                this.clearWallet();
                return this.readWallet();
            }

        } );

        await global.apacache.start();


        Consensus.on("consensus/blockchain-info-updated", info => this.$store.commit('setBlockchainInfo', info) );

        Consensus.on("consensus/block-info-downloaded", data => this.$store.commit('setBlockchainBlockInfo', data) );

        Consensus.on("consensus/status-update", status =>  this.$store.commit('setConsensusStatus', status) );

        Consensus.on("consensus/block-downloaded", data => this.$store.commit('setBlockchainBlock', data ) );

        Consensus.on("consensus/block-deleted", data => this.$store.commit('deleteBlockchainBlock', data ) );

        Consensus.on("consensus/account-update", data => this.$store.commit('setAddressWalletBalances', data ) );

        await Consensus.start();

    },

    methods:{

        readWallet(){

            const wallet = global.apacache.wallet;

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

            const wallet = global.apacache.wallet;

            if ( !wallet.isLoggedIn() ) return;

            let minerAddress = localStorage.getItem('mainAddress') || null;

            let firstAddress;
            const addresses = {};
            for (let i=0; i < wallet.addresses.length; i++ ){

                const publicAddress =  wallet.addresses[i].decryptPublicAddress();
                const publicKey = wallet.addresses[i].decryptPublicKey();

                const mnemonicSequenceIndex =  wallet.addresses[i].decryptMonemonicSequenceIndex();
                const mnemonicSequenceIndexValue = Number.parseInt( mnemonicSequenceIndex.toString("hex"), 16);

                const address = publicAddress.calculateAddress();

                addresses[address] = {
                    address: address,
                    publicKey: publicKey.toString("hex"),
                    publicKeyHash: publicAddress.publicKeyHash.toString("hex"),
                    name: wallet.addresses[i].name,
                    mnemonicSequenceIndex: mnemonicSequenceIndexValue ,
                    identicon: publicAddress.identiconImg(),
                };

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
            Consensus.subscribeAccounts( Object.keys(addresses) );

            Consensus.getBlockchain();

            this.$store.commit('setAddresses', addresses );


        }

    },

}
</script>