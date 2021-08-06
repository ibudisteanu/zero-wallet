<template>

    <layout>

        <layout-title icon="fa-cube" title="Explore Block">View a specific block.</layout-title>

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

                <loading-spinner v-if="!loaded"/>
                <template v-else-if="blk">

                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Hash</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.bloom.hash}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Kernel Hash</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.bloom.kernelHash}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Confirmations</span>
                        <span class="col-7 col-sm-9 text-truncate">{{ $store.state.blockchain.end - blk.height -1 }}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Time</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            {{  timeAgo( $store.state.blockchain.genesisTimestamp + blk.timestamp ) }} ago
                            <i class="fa fa-clock"></i>
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
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Fees</span>
                        <span class="col-7 col-sm-9 text-truncate">TODO</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Reward</span>
                        <span class="col-7 col-sm-9 text-truncate">{{this.reward}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Version</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.version}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Size</span>
                        <span class="col-7 col-sm-9 text-truncate">{{formatBytes( blk.bloomBlkComplete.size) }}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Forger</span>
                        <div class="col-7 col-sm-9 text-truncate">
                            <account-identicon class="vertical-center" :public-key-hash="blk.bloom.delegatedPublicKeyHash" :size="20" :outer-size="5"  />
                            <span class="forger-address">{{blk.bloom.delegatedPublicKeyHash}}</span>
                        </div>
                    </div>
                </template>

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
            <div class="card-body p-3 fs--1">
                <p class="div-scrollable" style="text-align: left">{{blk}}</p>
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
            <div class="card-body p-3 fs--1">
                <show-transactions :transactions="txs"/>
            </div>
        </div>

    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import ShowBlocksInfo from "src/components/explorer/show-blocks-info"
import LoadingSpinner from "src/components/utils/loading-spinner";
import ShowTransactions from "src/components/explorer/show-transactions"
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import AlertBox from "src/components/utils/alert-box"

import StringHelper from "src/utils/string-helper"

export default {

    components: {LoadingSpinner, Layout, ShowBlocksInfo, ShowTransactions, AccountIdenticon, AlertBox, LayoutTitle },

    data(){
        return {

            fees: null, //async data
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
            if (this.query && this.query.length < 10)
                return Number.parseInt(this.query)
        },
        hash(){
            if (this.query && this.query.length === 64)
                return this.query
        },
        blk(){
            if (this.height !== undefined )
                return this.$store.state.blocks.blocksByHeight[this.height]

            return this.$store.state.blocks.blocksByHash[this.hash]
        },
        txs(){
            if (!this.blk) return null;
            return this.blk.txs.map(it => it.hash)
        }

    },

    methods: {

        timeAgo: (timestamp) => StringHelper.timeSince( timestamp*1000 ),
        formatBytes: (bytes) => StringHelper.formatBytes(bytes, 1),
        formatMoney: (amount) => StringHelper.formatMoney(amount, PandoraPay.config.coins.DECIMAL_SEPARATOR  ),

        async loadBlock(){

            try{

                this.loaded = false
                this.error = '';
                this.reward = ''

                if (this.height === undefined && !this.hash) throw 'Block index was not specified';

                await this.$store.state.blockchain.syncPromise;

                if (this.height !== undefined) await this.$store.dispatch('getBlockByHeight', this.height);
                if (this.hash ) await this.$store.dispatch('getBlockByHash', this.hash);

                if (this.blk){
                    this.$store.commit('setViewBlockHash', this.blk.bloom.hash )
                    const reward = PandoraPay.config.reward.getRewardAt(this.blk.height)
                    this.reward = StringHelper.formatMoney( PandoraPay.config.coins.convertToBase( reward.toString() ), PandoraPay.config.coins.DECIMAL_SEPARATOR )
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

        hash(from, to) {
          if (from === to) return
        },

        height(from, to){
          if (from === to) return
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
