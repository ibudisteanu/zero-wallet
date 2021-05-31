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

                    <div v-if="!block || !loaded">
                        <loading-spinner/>
                    </div>
                    <div v-else>
                        <div class="table">

                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Hash</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.block.bloom.hash}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Kernel Hash</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.block.bloom.kernelHash}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Confirmations</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{ $store.state.blockchain.end - block.block.height -1 }}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Time</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{  timeAgo( $store.state.blockchain.genesisTimestamp + block.block.timestamp ) }} ago</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Height</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.height}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Number of Transactions</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.txs.length}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Merkle root</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.block.merkleHash}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Previous Hash</span>
                                <span class="col-xs-7 col-sm-9 wordwrap"><router-link :to="`/explorer/block/hash/${block.block.prevHash}`">{{block.block.prevHash}}</router-link></span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Previous Kernel Hash</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.block.prevKernelHash}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Fees</span>
                                <span class="col-xs-7 col-sm-9 wordwrap"><strong>TODO</strong></span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Reward</span>
                                <span class="col-xs-7 col-sm-9 wordwrap"><strong>TODO</strong></span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Version</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.block.version}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Size</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.bloom.size}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Forger</span>
                                <div class="col-xs-7 col-sm-9">
                                    <account-identicon class="vertical-center" :address="block.block.bloom.delegatedPublicPublicKeyHash" :size="20" :outer-size="5"  />
                                    <span class="forger-address wordwrap">{{block.block.bloom.delegatedPublicPublicKeyHash}}</span>
                                </div>
                            </div>
                            <div class="row pd-top-40 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">JSON</span>
                                <textarea class="col-xs-7 col-sm-9" rows="20">{{ block }}</textarea>
                            </div>
                        </div>

                        <h4>Transactions</h4>
                        <show-transactions :transactions="transactions"/>

                    </div>

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

            fees: 'loading', //async data
            transactions: 'loading',
            loaded: false,

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

        block(){

            let block;
            if (this.height) block = this.$store.state.blockchain.blocks[this.height];
            if (this.hash) block = this.$store.state.blockchain.blocksByHash[this.hash];

            if (block) {
                this.transactions = block.txs;
                this.loaded = true;
            } else {
                Object.assign(this.$data, this.$options.data());
            }

            return block;

        },

    },

    methods: {

        timeAgo(timestamp){
            return StringHelper.timeSince( timestamp*1000 );
        },

        async loadBlock(){

            if (this.height === undefined && !this.hash){
                this.error = 'Block index was not specified';
                return;
            }

            this.error = '';

            await Consensus.syncPromise;

            if (this.height !== undefined)  return Consensus.getBlock(this.height);
            if (this.hash ) return Consensus.getBlockByHash(this.hash);

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
