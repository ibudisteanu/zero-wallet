<template>

    <div>

        <template v-if="!error">

            <!-- component matched by the route will render here -->
            <router-view></router-view>

        </template>

        <alert-box v-if="error" type="error">{{error}}</alert-box>

        <notifications position="bottom left" />

    </div>

</template>

<script>

import Identicons from "src/utils/identicons"
import AlertBox from "src/components/utils/alert-box"
import consts from "consts/consts"

export default {

    components: {  AlertBox },

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

    beforeMount(){
        this.$store.commit('createSyncPromise')
    },

    async mounted(){

        if (typeof window === "undefined") return;

        if (typeof localStorage !== "undefined" && localStorage.getItem('dark') === 'true')
            this.$store.commit('setDark', true)

        setTimeout( ()=> this.clearUnusedDataStoreWorker(), 1000)

        this.$store.commit('setNetworkByte', {
            networkByte: PandoraPay.config.NETWORK_SELECTED,
            networkPrefix: PandoraPay.config.NETWORK_SELECTED_NAME,
            networkName: PandoraPay.config.NETWORK_SELECTED_NAME,
        })


        let initialized = false
        PandoraPay.events.listenEvents( (name, data )=>{

            if (name === "main")
                if (data === "initialized"){
                    initialized = true

                    PandoraPay.events.listenNetworkNotifications(( subscriptionType, key, data, extraInfo)=>{

                        console.log("listenNetworkNotifications", data, extraInfo)

                        if (subscriptionType === PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT)
                            return this.$store.commit('accountNotification', {publicKeyHash: key, account: JSON.parse(data) })

                        if (subscriptionType === PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_TRANSACTIONS)
                            return this.$store.dispatch('accountTransactionsNotification', { publicKeyHash: key, txHash:data.substr(1,64), extraInfo: JSON.parse(extraInfo) } )
                    })

                    this.readWallet()
                }

            if (name === "sockets/totalSocketsChanged"){
                if (data > 0) this.$store.commit('setConsensusStatus', "online")
                else this.$store.commit('setConsensusStatus', "offline")
            }

            if (initialized) {
                if (name === "wallet/added")
                    this.readWallet()
                else
                if (name === "wallet/removed")
                    this.readWallet()
                else
                if (name === "consensus/update"){
                    this.processUpdate(JSON.parse(data))
                }
            }
            console.log("JS NAME:", name, "data", data)
        })

        PandoraPay.helpers.start().then(()=>{

        })

    },

    methods:{

        async processUpdate(data){
            if (this.$store.state.blockchain.status === 'online')
                this.$store.commit('setConsensusStatus', "sync")

            this.$store.commit('setBlockchainInfo', data)
            await this.$store.dispatch('getBlocksInfo',  {starting: this.$store.state.blockchain.end - consts.blocksInfoPagination, blockchainEnd: this.$store.state.blockchain.end } )

            for (const key in this.$store.state.wallet.addresses)
                await this.$store.dispatch('subscribeAccount', this.$store.state.wallet.addresses[key].publicKeyHash)
        },

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

            let mainPublicKeyHash = localStorage.getItem('mainPublicKeyHash') || null;

            let firstAddress;
            const addresses = {};
            for (let i=0; i < wallet.addresses.length; i++ ){

                const publicKeyHash = wallet.addresses[i].publicKeyHash
                const addr = {
                    ...wallet.addresses[i],
                    loaded: false,
                    identicon: await Identicons.getIdenticon(publicKeyHash),
                };

                addresses[publicKeyHash] = addr;

                if (i === 0)
                    firstAddress = publicKeyHash;
            }

            //localstorage
            if (mainPublicKeyHash && addresses[mainPublicKeyHash])
                this.$store.commit('setMainPublicKeyHash', mainPublicKeyHash);

            if (this.$store.state.wallet.mainPublicKeyHash && !addresses[this.$store.state.wallet.mainPublicKeyHash])
                this.$store.commit('setMainPublicKeyHash', null );

            if (!this.$store.state.wallet.mainPublicKeyHash && firstAddress )
                this.$store.commit('setMainPublicKeyHash', firstAddress );

            this.$store.commit('addWalletAddresses', addresses );

        },

        clearUnusedDataStoreWorker(){

            try{
                for (const hash in this.$store.state.blocks.blocksByHash){
                    const blk = this.$store.state.blocks.blocksByHash[hash]
                    if (blk.bloom.hash !== this.$store.state.blocks.viewBlockHash && new Date().getTime() - blk.__timestampUsed > 5*60*1000)
                        this.$store.commit('deleteBlock', {height: blk.height, hash: blk.bloom.hash })
                }

                for (const height in this.$store.state.blocks.blocksByHeight){
                    const blk = this.$store.state.blocks.blocksByHeight[height]
                    if (blk.bloom.hash !== this.$store.state.blocks.viewBlockHash && new Date().getTime() - blk.__timestampUsed > 5*60*1000)
                        this.$store.commit('deleteBlock', {height: blk.height, hash: blk.bloom.hash })
                }
            }catch(err){
                console.error("clearUnusedDataStoreWorker raised an error", err)
            }

            setTimeout( ()=> this.clearUnusedDataStoreWorker(), 1000)

        }

    },

}
</script>


<style scoped>

</style>
