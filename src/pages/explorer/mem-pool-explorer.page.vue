<template>

    <layout>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Mem pool</h5>
                        <div class="subtitle">
                            <h6>Pending Transactions: {{pendingCount}}</h6>
                            <i class="fa fa-sync pointer" @click="downloadMempool" v-tooltip.bottom="`Download again the mempool`" ></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body p-3">

                <div v-for="(  hash, key ) in pendingTxs"
                     :class="`row g-0  py-2  border-bottom border-200 d-flex ${key % 2 === 1 ?'bg-light':''}`" style="text-align: center"
                     :key="`pending_${hash}`">

                    <router-link :to="`/explorer/tx/${hash}`" >
                        <span class="d-block text-truncate fs--1"> {{hash}} </span>
                    </router-link>

                </div>

                <loading-button  v-if="hasMore" icon="fa fa-arrow-down" text="Load more" @submit="handleLoadMore" />

            </div>
        </div>

    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import Consensus from "src/consensus/consensus"
import LoadingButton from "src/components/utils/loading-button.vue"
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

    components: { Layout, LoadingButton, LoadingSpinner },

    data(){
        return {
            error: '',
            loaded: false,
        }
    },

    computed:{
        pendingCount(){
            return this.$store.state.mempool.count
        },
        hasMore(){
            return this.$store.state.mempool.hasMore
        },
        pendingTxs(){
            return Object.keys(this.$store.state.mempool.list)
        }
    },

    methods:{

        async downloadMempool(){

            try{
                this.error = ""
                this.loaded = false

                await Consensus.syncPromise;
                await Consensus.downloadMempool(this.$store.state.mempool.next);
            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
            }

        },

        async handleLoadMore(resolver){
            try{

                this.error = ""

                await Consensus.syncPromise;
                await Consensus.downloadMempool();

            }catch(err){
                this.error = err.toString()
            }finally{
                resolver(true)
            }
        }

    },

    watch: {
        '$route' (to, from) {
            return this.downloadMempool();
        }
    },

    mounted(){
        return this.downloadMempool();
    },


}

</script>

<style scoped>
    .subtitle i, .subtitle h6 {
        display: inline-block;
    }
    .subtitle i {
        padding-left: 10px;
    }
</style>
