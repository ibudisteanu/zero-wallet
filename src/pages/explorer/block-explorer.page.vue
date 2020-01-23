<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Block Explorer</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <div v-if="!error">

                    <h3>Block {{height ? height : hash}} </h3>

                    <div v-if="!block || !loaded">
                        <loading-spinner/>
                    </div>
                    <div v-else>
                        <div class="table">
                            <div class="table-row">
                                <span>Hash</span>
                                <span>{{block.hash().toString("hex")}}</span>
                            </div>
                            <div class="table-row">
                                <span>Kernel Hash</span>
                                <span>{{block.kernelHash().toString("hex")}}</span>
                            </div>
                            <div class="table-row">
                                <span>Confirmations</span>
                                <span>{{ $store.state.blockchain.end - block.height -1 }}</span>
                            </div>
                            <div class="table-row">
                                <span>Time</span>
                                <span>{{  block.timestamp }}</span>
                            </div>
                            <div class="table-row">
                                <span>Height</span>
                                <span>{{block.height}}</span>
                            </div>
                            <div class="table-row">
                                <span>Number of Transactions</span>
                                <span>{{block.txCount()}}</span>
                            </div>
                            <div class="table-row">
                                <span>Difficulty</span>
                                <span>{{block.difficulty.toString(10)}}</span>
                            </div>
                            <div class="table-row">
                                <span>Merkle root</span>
                                <span>{{block.transactionsMerkleTree.hash().toString("hex")}}</span>
                            </div>
                            <div class="table-row">
                                <span>Account Tree root</span>
                                <span>{{block.accountTreeHash.toString("hex")}}</span>
                            </div>
                            <div class="table-row">
                                <span>Previous Hash</span>
                                <span><router-link :to="`/explorer/block/hash/${block.prevHash.toString('hex')}`">{{block.prevHash.toString("hex")}}</router-link></span>
                            </div>
                            <div class="table-row">
                                <span>Previous Kernel Hash</span>
                                <span>{{block.prevKernelHash.toString("hex")}}</span>
                            </div>
                            <div class="table-row">
                                <span>Fees</span>
                                <span>{{fees}}</span>
                            </div>
                            <div class="table-row">
                                <span>Reward</span>
                                <span>{{block.reward()}}</span>
                            </div>
                            <div class="table-row">
                                <span>Version</span>
                                <span>{{block.version}}</span>
                            </div>
                            <div class="table-row">
                                <span>Size</span>
                                <span>{{block.size()}}</span>
                            </div>
                            <div class="table-row">
                                <span>Forger</span>
                                <div class="vertical-center">
                                    <account-identicon class="vertical-center" :address="block.pos.stakeForgerAddress" :size="20" :outer-size="5"  />
                                    <span class="forger-address">{{block.pos.stakeForgerAddress}}</span>
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

    .table-row{
        grid-template-columns: 200px 1fr;
    }

    .forger-address{
        display: inline-block;
    }

</style>