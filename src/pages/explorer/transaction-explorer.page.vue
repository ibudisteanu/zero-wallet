<template>

    <layout>

        <layout-title icon="fa fa-file-invoice-dollar" title="Transaction" >View a transaction.</layout-title>

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
                        <div class="col-7 col-sm-9 text-truncate">
                            <span v-if="txInfo && txInfo.height">
                                {{txInfo.height}}
                            </span>
                            <span v-else>
                                -
                            </span>
                        </div>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Block Height</span>
                        <div class="col-7 col-sm-9 text-truncate">
                            <span v-if="txInfo && txInfo.blkHeight ">
                                <router-link :to="`/explorer/block/${txInfo.blkHeight}`">{{txInfo.blkHeight}}</router-link>
                            </span>
                            <span v-else>
                                -
                            </span>
                        </div>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Block Timestamp</span>
                        <div class="col-7 col-sm-9 text-truncate" >
                            <span v-if="txInfo && txInfo.timestamp" v-tooltip.bottom="`${ formatTime( $store.state.blockchain.genesisTimestamp +  txInfo.timestamp ) }`">
                                {{timeAgo( $store.state.blockchain.genesisTimestamp + txInfo.timestamp) }}
                                <i class="fa fa-clock"></i>
                            </span>
                            <span v-else>
                                -
                            </span>
                        </div>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Confirmations</span>
                        <div class="col-7 col-sm-9 text-truncate">
                            <span v-if="txInfo && txInfo.blkHeight">
                                {{ $store.state.blockchain.end - txInfo.blkHeight -1 }}
                                <i v-if="$store.state.blockchain.end - txInfo.blkHeight -1 > 8" class="fa fa-check"></i>
                            </span>
                            <span v-else>
                                -
                            </span>
                        </div>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Mem Pool</span>
                        <span class="col-7 col-sm-9 text-truncate">{{txInfo.mempool ? 'YES': ' No' }}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Size</span>
                        <div class="col-7 col-sm-9 text-truncate">
                            <span v-tooltip.bottom="`${ formatBytes(tx.size) }`">
                                {{formatSize(tx.size)}}
                            </span>
                        </div>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Unlock Time</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.unlockTime}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Version</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.version}}</span>
                    </div>

                    <template v-if="tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE" >

                        <div class="row pt-2 pb-2">
                            <span class="col-5 col-sm-3 text-truncate">Script Version</span>
                            <span class="col-7 col-sm-9 text-truncate">
                                {{tx.txScript}} <span :class="`badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, tx.txScript)}`" v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, tx.txScript)">{{$store.getters.getTxScriptText(tx.version, tx.txScript)}}</span>
                            </span>
                        </div>

                        <div class="row pt-2 pb-2 bg-light">
                            <span class="col-5 col-sm-3 text-truncate">Nonce</span>
                            <span class="col-7 col-sm-9 text-truncate">{{tx.nonce}}</span>
                        </div>

                        <div class="row pt-2 pb-2">
                            <span class="col-5 col-sm-3 text-truncate">Fee</span>
                            <span class="col-7 col-sm-9 text-truncate">{{tx.fee}}</span>
                        </div>

                        <div class="row pt-2 pb-2 bg-light">
                            <span class="col-5 col-sm-3 text-truncate">Data</span>
                            <span class="col-7 col-sm-9 text-truncate">
                                <show-transaction-data :tx="tx" />
                            </span>
                        </div>

                        <div class="row pt-2 pb-2">
                            <span class="col-5 col-sm-3 text-truncate">Extra Data</span>
                            <span class="col-7 col-sm-9 text-truncate">
                                <show-transaction-data-extra :dataVersion="tx.dataVersion" :data="tx.data" />
                            </span>
                        </div>

                        <div class="row pt-2 pb-2  bg-light">
                            <span class="col-5 col-sm-3 text-truncate">Extra Data as HEX</span>
                            <span class="col-7 col-sm-9 text-truncate">
                                {{tx.data}}
                            </span>
                        </div>

                    </template>
                    <template v-if="tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER">

                        <div v-for="(payload, index) in tx.payloads"
                             :key="`tx_payload_${index}`" >

                            <div class="row pt-2 pb-2">
                                <span class="col-5 col-sm-3 text-truncate">Payload Script Version</span>
                                <span class="col-7 col-sm-9 text-truncate">
                                {{payload.payloadScript}} <span :class="`badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, payload.payloadScript)}`" v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, payload.payloadScript)">{{$store.getters.getTxScriptText(tx.version, payload.payloadScript)}}</span>
                            </span>
                            </div>

                            <div class="row pt-2 pb-2  bg-light">
                                <span class="col-5 col-sm-3 text-truncate">Payload {{index}} Data</span>
                                <span class="col-7 col-sm-9">
                                    <show-transaction-data :tx="tx" :id="index" />
                                </span>
                            </div>

                            <div class="row pt-2 pb-2 ">
                                <span class="col-5 col-sm-3 text-truncate">Payload {{index}} Extra</span>
                                <span class="col-7 col-sm-9 text-truncate">
                                    <show-transaction-data-extra :dataVersion="payload.dataVersion" :data="payload.data" />
                                </span>
                            </div>
                            <div class="row pt-2 pb-2 bg-light">
                                <span class="col-5 col-sm-3 text-truncate">Payload {{index}} Extra HEX</span>
                                <span class="col-7 col-sm-9 text-truncate">
                                    {{payload.data}}
                                </span>
                            </div>
                        </div>

                    </template>

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
import LoadingButton from "src/components/utils/loading-button";
import ShowTransactionData from "src/components/explorer/tx/show-transaction-data"
import ShowTransactionDataExtra from "src/components/explorer/tx/show-transaction-data-extra";

export default {

    components: {
        ShowTransactionDataExtra,
        LoadingButton, Layout, LoadingSpinner, AccountIdenticon, Amount, AlertBox, LayoutTitle, ShowTransactionData},

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
        txInfo(){
            if (this.tx) return this.$store.state.transactionsInfo.list[this.tx.hash]
        },

        PandoraPay(){
            return PandoraPay
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
            this.$store.commit('updateViewTransactionsHashes', {txsHashes: [tx.hash], insert: false} )
            await this.$store.dispatch('unsubscribeTransaction', tx.hash )
        },

        timeAgo : (timestamp) => StringHelper.timeSince( timestamp*1000, false ),
        formatTime : (timestamp) => StringHelper.formatTime( timestamp*1000 ),
        formatSize: (bytes) => StringHelper.formatSize(bytes, 1),
        formatBytes: (bytes) => StringHelper.formatBytes(bytes),

        async handleDecryptExtraData(resolver){
            try{

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                await this.$store.dispatch('decryptTxData', {tx: this.tx, password, commitNow: true })

            }finally{
                resolver()
            }
        }

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
