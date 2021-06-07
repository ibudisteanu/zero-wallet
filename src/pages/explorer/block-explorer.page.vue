<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Block Explorer</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <div v-if="!error">

                    <h3 class="wordwrap">Block {{height ? height : hash}} </h3>

                    <template v-if="!loaded || !blk ">
                        <loading-spinner/>
                    </template>
                    <template v-else>
                        <div class="table">

                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Hash</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{blk.bloom.hash}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Kernel Hash</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{blk.bloom.kernelHash}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Confirmations</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{ $store.state.blockchain.end - blk.height -1 }}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Time</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{  timeAgo( $store.state.blockchain.genesisTimestamp + blk.timestamp ) }} ago</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Height</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{blk.height}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Number of Transactions</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{blk.txs.length}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Merkle root</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{blk.merkleHash}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Previous Hash</span>
                                <span class="col-xs-7 col-sm-9 wordwrap"><router-link :to="`/explorer/block/hash/${blk.prevHash}`">{{blk.prevHash}}</router-link></span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Previous Kernel Hash</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{blk.prevKernelHash}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Fees</span>
                                <span class="col-xs-7 col-sm-9 wordwrap"><strong>TODO</strong></span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Reward</span>
                                <span class="col-xs-7 col-sm-9 wordwrap"><strong>{{formatMoney(this.reward)}}</strong></span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Version</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{blk.version}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Size</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{formatBytes( blk.bloomBlkComplete.size) }}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Forger</span>
                                <div class="col-xs-7 col-sm-9">
                                    <account-identicon class="vertical-center" :public-key-hash="blk.bloom.delegatedPublicKeyHash" :size="20" :outer-size="5"  />
                                    <span class="forger-address wordwrap">{{blk.bloom.delegatedPublicKeyHash}}</span>
                                </div>
                            </div>
                            <div class="row pd-top-40 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">JSON</span>
                                <textarea class="col-xs-7 col-sm-9" rows="20">{{ blk }}</textarea>
                            </div>
                        </div>

                        <h4>Transactions</h4>
                        <show-transactions :transactions="txs"/>

                    </template>

                </div>


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

        height(){
            return this.$route.params.height;
        },
        hash(){
            return this.$route.params.hash;
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

                if (this.height !== undefined) await  Consensus.getBlock(this.height);
                if (this.hash ) await Consensus.getBlockByHash(this.hash);

                const reward = await PandoraPay.config.reward.getRewardAt(this.blk.height)
                this.reward = await PandoraPay.config.coins.convertToBase( reward.toString() )

                this.loaded = true

            }catch(err){
                this.error = err.toString()
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
