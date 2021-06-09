<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Mem pool</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <template v-if="!loaded">
                    <loading-spinner />
                </template>
                <template v-else>

                    <div class="subtitle">
                        <h3>Pending Transactions: {{pendingCount}}</h3>
                        <i class="fa fa-sync pointer" @click="downloadMempool" v-tooltip.bottom="`Download again the mempool`" ></i>
                    </div>

                    <div v-for="( _, hash ) in pendingTxs"
                         :key="`pending_${hash}`"
                         class="row pd-bottom-10">
                        <router-link :to="`/explorer/tx/hash/${hash}`" >
                            <span class="wordwrap"> {{hash}} </span>
                        </router-link>
                    </div>

                    <loading-button  v-if="hasMore" icon="fa fa-arrow-down" text="Load more" @submit="handleLoadMore" />

                </template>

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
            return this.$store.state.mempool.list
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
    .subtitle i, .subtitle h3 {
        display: inline-block;
    }
    .subtitle h3 {
        padding-right: 10px;
    }
</style>
