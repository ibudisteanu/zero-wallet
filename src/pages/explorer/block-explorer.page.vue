<template>

    <layout>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Block Explorer {{height ? height : hash}}  </h5>
                        <loading-spinner v-if="!loaded"/>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 fs--1">

                <div v-if="error" class="alert alert-error border-2 d-flex align-items-center" role="alert">
                    <div class="bg-warning me-3 icon-item"><i class="fa fa-error"></i> </div>
                    <p class="mb-0 flex-1">{{error}}</p>
                </div>
                <template v-else-if="blk">

                    <div class="row pt-2 pb-2">
                        <span class="col-xs-5 col-sm-3 text-truncate">Hash</span>
                        <span class="col-xs-7 col-sm-9 text-truncate">{{blk.bloom.hash}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-xs-5 col-sm-3 text-truncate">Kernel Hash</span>
                        <span class="col-xs-7 col-sm-9 text-truncate">{{blk.bloom.kernelHash}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-xs-5 col-sm-3 text-truncate">Confirmations</span>
                        <span class="col-xs-7 col-sm-9 text-truncate">{{ $store.state.blockchain.end - blk.height -1 }}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-xs-5 col-sm-3 text-truncate">Time</span>
                        <span class="col-xs-7 col-sm-9 text-truncate">{{  timeAgo( $store.state.blockchain.genesisTimestamp + blk.timestamp ) }} ago</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-xs-5 col-sm-3 text-truncate">Height</span>
                        <span class="col-xs-7 col-sm-9 text-truncate">{{blk.height}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-xs-5 col-sm-3 text-truncate">Number of Transactions</span>
                        <span class="col-xs-7 col-sm-9 text-truncate">{{blk.txs.length}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-xs-5 col-sm-3 text-truncate">Merkle root</span>
                        <span class="col-xs-7 col-sm-9 text-truncate">{{blk.merkleHash}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-xs-5 col-sm-3 text-truncate">Previous Hash</span>
                        <span class="col-xs-7 col-sm-9 text-truncate">
                            <router-link :to="`/explorer/block/${blk.prevHash}`" class="p-0">{{blk.prevHash}}</router-link>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-xs-5 col-sm-3 text-truncate">Previous Kernel Hash</span>
                        <span class="col-xs-7 col-sm-9 text-truncate">{{blk.prevKernelHash}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-xs-5 col-sm-3 text-truncate">Fees</span>
                        <span class="col-xs-7 col-sm-9 text-truncate">TODO</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-xs-5 col-sm-3 text-truncate">Reward</span>
                        <span class="col-xs-7 col-sm-9 text-truncate">{{formatMoney(this.reward)}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-xs-5 col-sm-3 text-truncate">Version</span>
                        <span class="col-xs-7 col-sm-9 text-truncate">{{blk.version}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-xs-5 col-sm-3 text-truncate">Size</span>
                        <span class="col-xs-7 col-sm-9 text-truncate">{{formatBytes( blk.bloomBlkComplete.size) }}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-xs-5 col-sm-3 text-truncate">Forger</span>
                        <div class="col-xs-7 col-sm-9">
                            <account-identicon class="vertical-center" :public-key-hash="blk.bloom.delegatedPublicKeyHash" :size="20" :outer-size="5"  />
                            <span class="forger-address text-truncate">{{blk.bloom.delegatedPublicKeyHash}}</span>
                        </div>
                    </div>
                </template>

            </div>

        </div>

        <div class="card mb-3" v-if="blk">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Block JSON {{blk.height}}  </h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 fs--1">
                <div class="row">
                    <span class="col-xs-4 col-sm-2 col-md-1 text-truncate">JSON</span>
                    <div class="col-xs-8 col-sm-10 col-md-11">
                        <div class="card mb-3" >
                            <div class="card-body ">
                                <p class="mb-0  div-scrollable" style="text-align: left">{{blk}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card mb-3" v-if="blk">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Block Transactions {{blk.height}}  </h5>
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
import ShowBlocksInfo from "src/components/explorer/show-blocks-info"
import LoadingSpinner from "src/components/utils/loading-spinner";
import ShowTransactions from "src/components/explorer/show-transactions"
import AccountIdenticon from "src/components/wallet/account/account-identicon";

import Consensus from "src/consensus/consensus"
import StringHelper from "src/utils/string-helper"

export default {

    components: {LoadingSpinner, Layout, ShowBlocksInfo, ShowTransactions, AccountIdenticon },

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
            return this.$route.params.query;
        },
        height(){
            if (this.query && this.query.length < 10)
                return Number.parseInt(this.query)
        },
        hash(){
            if (this.query && this.query.length === 32)
                return this.query
        },
        blk(){
            if (this.height !== undefined )
                return this.$store.state.blocks.blocks[this.height]

            return this.$store.state.blocks.blocksByHash[this.hash]
        },
        txs(){
            if (!this.blk) return null;
            return this.blk.txs
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

                if (this.height === undefined && !this.hash) throw 'Block index was not specified';

                await Consensus.syncPromise;

                if (this.height !== undefined) await Consensus.getBlockByHeight(this.height);
                if (this.hash ) await Consensus.getBlockByHash(this.hash);

                const reward = await PandoraPay.config.reward.getRewardAt(this.blk.height)
                this.reward = await PandoraPay.config.coins.convertToBase( reward.toString() )

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
        }
    },

    async mounted(){
        return this.loadBlock();
    }

}

</script>

<style scoped>
</style>
