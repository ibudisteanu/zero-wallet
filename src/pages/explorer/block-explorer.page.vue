<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Block Explorer</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <h3>Block {{height ? height : hash}} </h3>

                <div class="table" v-if="block">
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
                        <span>{{}}</span>
                    </div>
                    <div class="table-row">
                        <span>Timestamp</span>
                        <span>{{block.timestamp}}</span>
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
                        <span>{{block.prevHash.toString("hex")}}</span>
                    </div>
                    <div class="table-row">
                        <span>Previous Kernel Hash</span>
                        <span>{{block.prevKernelHash.toString("hex")}}</span>
                    </div>
                    <div class="table-row">
                        <span>Fees</span>
                        <span>{{block.sumFees()}}</span>
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
                </div>


            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import ShowBlocksInfo from "src/components/explorer/show-blocks-info"
import Consensus from "src/consensus/consensus"

export default {

    components: { Layout, ShowBlocksInfo },

    data(){
        return {
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

            if (this.height) return this.$store.state.blockchain.blocks[this.height];
            if (this.hash) return this.$store.state.blockchain.blocksByHash[this.hash];
        }
    },

    methods: {
    },

    async mounted(){

        if (this.height === undefined && !this.hash){
            this.error = 'Block index was not specified';
            return;
        }

        await Consensus.syncPromise;

        if (this.height !== undefined)  return Consensus.getBlock(this.height);
        else
        if (this.hash ) return Consensus.getBlockByHash(this.hash);

    }

}

</script>

<style scoped>

    .table-row{
        grid-template-columns: 200px 1fr;
    }

</style>