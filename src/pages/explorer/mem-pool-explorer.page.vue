<template>

    <layout>

        <layout-title icon="fas fa-list-ol" title="Mem pool">View the latest transactions that are in pending for the next blocks.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light" id="mempool">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Mem pool</h5>
                        <div class="subtitle">
                            <h6>Pending Transactions: {{mempoolCount}}</h6>
                            <i class="fas fa-sync pointer " @click="downloadMempool" v-tooltip.bottom="`Download again the mempool`" ></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body p-3">

                <template v-if="!loaded">
                    <loading-spinner/>
                </template>
                <template v-else>
                    <div v-for="(  hash, key ) in pendingTxs"
                         :class="`row g-0  py-2  border-bottom border-200 d-flex ${key % 2 === 1 ?'bg-light':''}`" style="text-align: center"
                         :key="`pending_${hash}`">

                        <router-link :to="`/explorer/tx/${hash}`" >
                            <span class="d-block text-truncate fs--1"> {{hash}} </span>
                        </router-link>
                    </div>
                    <pagination class="right pt-2" :inverted="true" :count-per-page="countPerPage" :current="page" :total="Math.trunc(mempoolCount/countPerPage)" prefix="/explorer/mem-pool/" suffix="#mempool" />
                </template>

            </div>
        </div>

    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import Pagination from "src/components/utils/pagination"
import consts from "consts/consts"
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

    components: { Layout, LayoutTitle, Pagination, LoadingSpinner },

    data(){
        return {
            error: '',
            loaded: false,
        }
    },

    computed:{
        countPerPage(){
            return consts.mempoolTxsPagination
        },
        mempoolCount(){
            return this.$store.state.mempool.count
        },
        pendingTxs(){
            return Object.keys(this.$store.state.mempool.list)
        },
        page(){
            let page = this.$route.params.page || 0
            if (typeof page == "string"){
                page = Number.parseInt(page)
                return page;
            }
            return page
        },
    },

    methods:{

        downloadMempool(){
            return this.handleLoadMore( 0 )
        },

        async handleLoadMore(page = this.page){
            try{

                this.loaded = false
                this.error = ""

                await this.$store.state.blockchain.syncPromise;
                await this.$store.dispatch('downloadMempool', page );

            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
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
