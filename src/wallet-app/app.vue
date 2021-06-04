<template>

    <div>

        <div v-if="!error">

            <!-- component matched by the route will render here -->
            <router-view></router-view>

        </div>

        <span v-if="error" class="danger">
            {{error}}
        </span>

        <notifications position="bottom left" />

    </div>

</template>

<script>

import Consensus from "src/consensus/consensus"
import Identicons from "src/utils/identicons"

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

        Consensus.on("consensus/blockchain-info-updated", info => this.$store.commit('setBlockchainInfo', info) )

        Consensus.on("consensus/block-info-downloaded", data => this.$store.commit('setBlockchainBlockInfo', data) );

        Consensus.on("consensus/block-downloaded", data => this.$store.commit('setBlockchainBlock', data ) );
        Consensus.on("consensus/block-deleted", data => this.$store.commit('deleteBlockchainBlock', data ) );

        Consensus.on("consensus/tx-downloaded", async data => this.$store.commit('setTransactions', data  ) );

        Consensus.on("consensus/status-update", status =>  this.$store.commit('setConsensusStatus', status) );

        let initialized = false
        PandoraPay.events.subscribe((name, data)=>{

            if (name === "main") {
                if (data === "initialized"){
                    initialized = true

                    this.readWallet()
                }
            }

            if (name === "sockets/totalSocketsChanged"){
                if (data > 0){
                    Consensus.status = "online"
                } else {
                    Consensus.status = "offline"
                }
            }

            if (initialized) {
                if (name === "wallet/added") {
                    this.readWallet()
                } else
                if (name === "wallet/removed") {
                    this.readWallet()
                }else
                if (name === "consensus/update"){
                    Consensus.processBlockchain(data)
                }
            }
            console.log("JS NAME:", name, "data", data)
        })

        this.$store.commit('setNetworkByte', {
            networkByte: PandoraPay.config.NETWORK_SELECTED,
            networkPrefix: PandoraPay.config.NETWORK_SELECTED_NAME,
            networkName: PandoraPay.config.NETWORK_SELECTED_NAME,
        })

        PandoraPay.helpers.start().then(()=>{

        })

    },

    methods:{

        async readWallet(){

            const wallet = JSON.parse( await PandoraPay.wallet.getWallet() )

            const loggedIn = true;
            this.$store.commit('setLoggedIn', loggedIn );

            this.$store.commit('setWallet', wallet );

            await this.readAddresses(wallet);

            const route = this.$router.currentRoute.path;
            if (!loggedIn && route.indexOf('/login') === -1 ){

                if ( route.indexOf('/explorer') === -1 && route.indexOf('/tokens') === -1 && route.indexOf('kad') === -1 )
                    this.$router.push('/login');

            }
            if (loggedIn && route.indexOf('/login') >= 0) this.$router.push('/');

            this.$store.commit('setLoaded', true);

        },

        clearWallet(){
            this.$store.commit('walletClear');
            this.$store.state.page.refLoadingModal.closeModal();
        },

        async readAddresses(wallet){

            let mainAddress = localStorage.getItem('mainAddress') || null;

            let firstAddress;
            const addresses = {};
            for (let i=0; i < wallet.addresses.length; i++ ){

                const addr = {
                    ...wallet.addresses[i],
                    loaded: false,
                    identicon: await Identicons.getIdenticon(wallet.addresses[i].publicKeyHash),
                };

                addresses[addr.addressEncoded] = addr;

                if (i === 0)
                    firstAddress = addr.addressEncoded;
            }

            //localstorage
            if (mainAddress && addresses[mainAddress])
                this.$store.commit('setMainAddress', mainAddress);

            if (this.$store.state.wallet.mainAddress && !addresses[this.$store.state.wallet.mainAddress])
                this.$store.commit('setMainAddress', null );

            if (!this.$store.state.wallet.mainAddress && firstAddress )
                this.$store.commit('setMainAddress', firstAddress );

            this.$store.commit('setAddresses', addresses );

        }

    },

}
</script>


<style scoped>

</style>
