<template>

    <layout>

        <layout-title icon="fa-file-invoice-dollar" title="Transaction" >View a transaction.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0 text-truncate">Tx {{height ? height : hash}}</h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 fs--1">

                <alert-box v-if="error" type="error">{{error}}</alert-box>

                <loading-spinner v-if="!loaded"/>
                <div v-else-if="tx">

                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Height</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <template v-if="tx.__height">
                                {{tx.__height}}
                            </template>
                            <template v-else>
                                -
                            </template>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Block Height</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <template v-if="tx.__blkHeight ">
                                <router-link :to="`/explorer/block/${tx.__blkHeight}`">{{tx.__blkHeight}}</router-link>
                            </template>
                            <template v-else>
                                -
                            </template>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Block Timestamp</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <template v-if="tx.__timestamp">
                                {{timeAgo( $store.state.blockchain.genesisTimestamp + tx.__timestamp) }}
                                <i class="fa fa-clock"></i>
                            </template>
                            <template v-else>
                                -
                            </template>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Confirmations</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <template v-if="tx.__blkHeight" >
                                {{ $store.state.blockchain.end - tx.__blkHeight -1 }}
                                <i v-if="$store.state.blockchain.end - tx.__blkHeight -1 > 8" class="fa fa-check"></i>
                            </template>
                            <template v-else>
                                -
                            </template>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Mem Pool</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.__mempool ? 'YES': ' No' }}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Size</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.size}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Nonce</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.nonce}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Unlock Time</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.unlockTime}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Data</span>
                        <div class="col-7 col-sm-9">
                            <div v-for="(vin, index) in tx.vin" class="input"
                                 :key="`transaction-explorer-vin-${index}`">
                                <account-identicon :publicKeyHash="vin.publicKeyHash" size="20" outer-size="5" />
                                <amount :value="vin.amount" :token="vin.token" :sign="false" />
                            </div>
                            <div v-for="(vout, index) in tx.vout" class="input"
                                 :key="`transaction-explorer-vout-${index}`">
                                <account-identicon :publicKeyHash="vout.publicKeyHash" size="20" outer-size="5" />
                                <amount :value="vout.amount" :token="vout.token" :sign="true" />
                            </div>
                        </div>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Extra Data</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.__data}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Version</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.version}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Script Version</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.txScript}}</span>
                    </div>

                </div>


            </div>

        </div>

        <div class="card mb-3" v-if="tx">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">JSON Transaction {{tx.__height}}  </h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 fs--1">
                <p class="div-scrollable" style="text-align: left">{{tx}}</p>
            </div>
        </div>

    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import LoadingSpinner from "src/components/utils/loading-spinner";
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import StringHelper from "src/utils/string-helper"
import Amount from "src/components/wallet/amount"
import AlertBox from "src/components/utils/alert-box"

export default {

    components: {Layout, LoadingSpinner, AccountIdenticon, Amount, AlertBox, LayoutTitle},

    data(){
        return {
            error: '',
            loaded: false,
        }
    },

    computed:{

        query(){
            return (this.$route.params.query||'').toLowerCase();
        },
        height(){
            if (this.query && this.query.length < 10)
                return Number.parseInt(this.query)
        },
        hash(){
            if (this.query && this.query.length === 64)
                return this.query
        },

        tx(){
            if (this.height !== undefined) return this.$store.state.transactions.txsByHeight[this.height];
            if (this.hash) return this.$store.state.transactions.txsByHash[this.hash];
        },

    },

    methods: {

        async loadTransaction(){

            try{
                this.loaded = false;
                this.error = ""

                if (this.height === undefined && !this.hash)
                    throw 'Tx height/hash was not specified';

                await this.$store.state.blockchain.syncPromise;

                if (this.tx)
                    await this.removed()

                if (this.height !== undefined) await this.$store.dispatch('getTransactionByHeight', this.height);
                if (this.hash ) await this.$store.dispatch('getTransactionByHash', this.hash);

                if (this.tx) {
                    this.$store.commit('updateViewTransactionsHashes', {txsHashes: [this.tx.hash], insert: true} )
                    await this.$store.dispatch('subscribeTransaction', this.tx.hash )
                }

            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
            }

        },

        async removed(tx = this.tx){
            this.$store.commit('removeViewTransactionsHashes', [tx.hash])
            await this.$store.dispatch('unsubscribeTransaction', tx.hash )
        },

        convertToBase: (amount) => PandoraPay.config.coins.convertToBase( amount.toString() ),
        timeAgo : (timestamp) => StringHelper.timeSince( timestamp*1000, false ),

    },

    watch: {
        '$route': {
            handler: async function (to, from ) {
                if (to === from) return
                return this.loadTransaction();
            },
        },

        async hash(to, from) {
          if (from === to) return

          this.$store.commit('updateViewTransactionsHashes', {txsHashes: [from], insert: false } )
          await this.$store.dispatch('unsubscribeTransaction', from )
        },

        async height(to, from){
            if (from === to) return

            const tx = this.$store.state.transactions.txsByHeight[from];
            if (tx) return this.removed(tx)
        },

    },

    mounted(){
        return this.loadTransaction();
    },

    beforeDestroy() {
        if (this.tx) return this.removed()
    },

}
</script>

<style scoped>

    .input, .output{
        display: inline-block;
    }

    .amount{
        display: inline-block;
    }

</style>
