<template>

    <layout>

        <layout-title icon="fas fa-cube" title="Explore Block">View a specific block.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0 text-truncate">
                            Block Explorer {{height ? height : hash}}
                        </h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 fs--1">

                <alert-box v-if="error" type="error">{{error}}</alert-box>

                <template v-if="!loaded">
                    <div class="py-3 text-center">
                        <loading-spinner/>
                    </div>
                </template>
                <template v-else-if="blk">

                    <div class="row pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Hash</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.bloom.hash}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Kernel Hash</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.bloom.kernelHash}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Confirmations</span>
                        <span class="col-7 col-sm-9 text-truncate">{{ $store.state.blockchain.end.minus( blk.height).minus(1) }}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Time</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <span  v-tooltip.bottom="`${ formatTime( $store.state.blockchain.genesisTimestamp.plus( blk.timestamp) ) }`">
                                {{  timeAgo( $store.state.blockchain.genesisTimestamp.plus( blk.timestamp ) ) }} ago
                                <i class="fas fa-clock"></i>
                            </span>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Height</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.height}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Number of Transactions</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.txs.length}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Merkle root</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.merkleHash}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Previous Hash</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <router-link :to="`/explorer/block/${blk.prevHash}`" class="p-0">{{blk.prevHash}}</router-link>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Previous Kernel Hash</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.prevKernelHash}}</span>
                    </div>
                    <div class="row pt-2 pb-2  bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Reward</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <amount :value="this.reward" :sign="true" />
                        </span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Version</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.version}}</span>
                    </div>

                    <div class="row pt-2 pb-2  bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Forger</span>
                        <div class="col-7 col-sm-9 text-truncate">
                            <account-identicon class="vertical-center" :public-key="blk.delegatedStakePublicKey" size="21" outer-size="7"  />
                            <span class="forger-address">{{blk.delegatedStakePublicKey}}</span>
                        </div>
                    </div>
                </template>

            </div>

        </div>

        <div class="card mb-3" v-if="blk">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Block Transactions {{txs.length}}  </h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 py-0 fs--1">
                <show-transactions-preview :transactions="txs"/>
            </div>
        </div>

        <div class="card mb-3" v-if="blk">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">JSON Block {{blk.height}}  </h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-0 fs--1">
                <textarea class="form-control form-control-sm fs--2" rows="10">{{JSONStringify(blk, null, 2)}}</textarea>
            </div>
        </div>

    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import ShowBlocksInfo from "src/components/explorer/show-blocks-info"
import LoadingSpinner from "src/components/utils/loading-spinner";
import ShowTransactionsPreview from "src/components/explorer/tx-preview/show-transactions-preview"
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import AlertBox from "src/components/utils/alert-box"
import Amount from "src/components/wallet/amount"
import StringHelper from "src/utils/string-helper"
import Decimal from "decimal.js"

export default {

    components: {LoadingSpinner, Layout, ShowBlocksInfo, ShowTransactionsPreview, AccountIdenticon, AlertBox, LayoutTitle, Amount },

    data(){
        return {

            loaded: false,

            reward: '',

            error: '',
        }
    },

    computed:{

        query(){
            return (this.$route.params.query||'').toLowerCase();
        },
        height(){
            try{
                if (this.query && this.query.length < 10) return new Decimal(this.query)
            }catch(err){
            }
        },
        hash(){
            if (this.query && this.query.length === 64) return this.query
        },
        blk(){
            if (this.height )
                return this.$store.state.blocks.blocksByHeight[this.height]

            return this.$store.state.blocks.blocksByHash[this.hash]
        },
        txs(){
            if (!this.blk) return null;
            return this.blk.txs
        }

    },

    methods: {

        timeAgo: (timestamp) => StringHelper.timeSince( timestamp*1000, false ),
        formatTime : (timestamp) => StringHelper.formatTime( timestamp*1000 ),
        JSONStringify: (a, b, c) => JSONStringify(a, b, c),

        async loadBlock(){

            try{

                this.loaded = false
                this.error = '';
                this.reward = ''

                if (!this.height && !this.hash) throw 'Block index was not specified';

                await this.$store.state.blockchain.syncPromise;

                if (this.height) await this.$store.dispatch('getBlockByHeight', this.height);
                if (this.hash ) await this.$store.dispatch('getBlockByHash', this.hash);

                if (this.blk){
                    this.$store.commit('setViewBlockHash', this.blk.bloom.hash )
                    this.reward = await PandoraPay.config.reward.getRewardAt( this.blk.height.toString() )
                }

            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
            }

        },

    },

    watch: {
        '$route' (to, from) {
            return this.loadBlock();
        },
    },

    async mounted(){
        return this.loadBlock();
    },

    beforeDestroy(){
        this.$store.commit('setViewBlockHash', null )
    }

}

</script>

<style scoped>
</style>
