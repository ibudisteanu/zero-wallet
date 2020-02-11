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
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.hash().toString("hex")}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Kernel Hash</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.kernelHash().toString("hex")}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Confirmations</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{ $store.state.blockchain.end - block.height -1 }}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Time</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{  timeAgo( $store.state.blockchain.genesisTimestamp + block.timestamp ) }} ago</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Height</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.height}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Number of Transactions</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.txCount()}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Difficulty</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.difficulty.toString(10)}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Merkle root</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.transactionsMerkleTree.hash().toString("hex")}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Previous Hash</span>
                                <span class="col-xs-7 col-sm-9 wordwrap"><router-link :to="`/explorer/block/hash/${block.prevHash.toString('hex')}`">{{block.prevHash.toString("hex")}}</router-link></span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Previous Kernel Hash</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.prevKernelHash.toString("hex")}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Fees</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{fees}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Reward</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.reward()}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Version</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.version}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Size</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{block.size()}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Forger</span>
                                <div class="col-xs-7 col-sm-9">
                                    <account-identicon class="vertical-center" :address="block.pos.stakeForgerAddress" :size="20" :outer-size="5"  />
                                    <span class="forger-address wordwrap">{{block.pos.stakeForgerAddress}}</span>
                                </div>
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
import Consensus from "src/consensus/consensus"
import LoadingSpinner from "src/components/utils/loading-spinner";
import Utils from "src/utils/utils"
import ShowTransactions from "src/components/explorer/show-transactions"
import AccountIdenticon from "src/components/wallet/account/account-identicon";

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

            const asyncData = async ()=>{

                if (block) {
                    console.log(block.toJSON() );
                    this.fees = await block.sumFees();
                    this.transactions = await block.getTransactions();

                    for (let tx of this.transactions){
                        tx.__extra = {
                            height: block.height,
                            timestamp: block.timestamp,
                        }
                    }

                    this.loaded = true;
                } else {
                    Object.assign(this.$data, this.$options.data());
                }

            };

            asyncData();

            return block;

        },

    },

    methods: {

        timeAgo(timestamp){
            return Utils.timeSince( timestamp*1000 );
        },

        async loadBlock(){

            if (this.height === undefined && !this.hash){
                this.error = 'Block index was not specified';
                return;
            }

            await Consensus.initPromise;

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