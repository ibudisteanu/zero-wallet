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

export default {

    components: {Layout},

}
</script>

<style>

    .table-row{
        grid-template-columns: 200px 1fr;
    }

</style>