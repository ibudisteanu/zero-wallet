<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Transaction Explorer</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <div v-if="!error">

                    <h3>Transaction {{height ? height : hash}} </h3>

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
                                    <account-identicon class="vertical-center" :address="block.pos.stakeForgerAddress" :size="20" :outer-size="20"  />
                                    <span class="forger-address">{{block.pos.stakeForgerAddress}}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>


            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import Consensus from "src/consensus/consensus"
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

    components: {Layout, Consensus, LoadingSpinner},

    methods: {

        computed:{

            height(){
                return this.$route.params.height;
            },
            hash(){
                return this.$route.params.hash;
            },

            tx(){

                let tx;
                if (this.height) tx = this.$store.state.blockchain.transactions[this.height];
                if (this.hash) tx = this.$store.state.blockchain.transactionsByHash[this.hash];

                return tx;

            },

        },

        async loadTransaction(){

            if (this.height === undefined && !this.hash){
                this.error = 'Tx index was not specified';
                return;
            }

            await Consensus.initPromise;

            if (this.height !== undefined)  return Consensus.getTransaction(this.height);
            else
            if (this.hash ) return Consensus.getTransactionByHash(this.hash);

        },

    },

    watch: {
        '$route' (to, from) {
            return this.loadTransaction();
        }
    },

    async mounted(){

        return this.loadTransaction();

    }

}
</script>

<style>

    .table-row{
        grid-template-columns: 200px 1fr;
    }

</style>