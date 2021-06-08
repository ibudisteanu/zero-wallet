<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Blockchain Explorer {{ ending ? ending : ''}}</h1>

                <router-link to="/explorer/pending-transactions">
                    <h3>View Pending Transactions</h3>
                </router-link>

                <h3>Last blocks forged</h3>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <template v-if="!loaded">
                    <loading-spinner/>
                </template>
                <template v-else>
                    <show-blocks-info :blocksInfo="lastBlocksInfo" />

                    <div class="centered">
                        <pagination :count-per-page="countPerPage" :current="page" :total="Math.ceil(ending/countPerPage)" :prefix="'/explorer/'" />
                    </div>
                </template>

            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import ShowBlocksInfo from "src/components/explorer/show-blocks-info"
import Pagination from "src/components/utils/pagination"
import Consensus from "src/consensus/consensus"
import LoadingSpinner from "src/components/utils/loading-spinner";
import consts from "consts/consts"

export default {

    components: { Layout, Pagination, ShowBlocksInfo, LoadingSpinner },

    data(){
        return {
            error: '',
            loaded: false,
        }
    },

    computed:{

        countPerPage(){
            return consts.blocksInfoPagination
        },

        page(){
            let page = this.$route.params.page || 1
            if (typeof page == "string"){
                page = Number.parseInt(page)
                return page;
            }
            return 1
        },

        lastBlocksInfo(){
            return this.$store.getters.blocksInfoSorted;
        },

        ending(){
            return this.$store.state.blockchain.end;
        },

    },

    methods: {

        async loadBlocksInfo(){

            this.loading = false

            await Consensus.syncPromise;

            try{
                await Consensus.getBlocksInfo( this.ending - ( this.page * this.countPerPage )  )

                this.loaded = true
            }catch(err){
                this.error = err.toString()
            }
        }

    },

    watch: {
        '$route' (to, from) {
            return this.loadBlocksInfo();
        }
    },

    mounted(){
        return this.loadBlocksInfo();
    }

}

</script>

<style scoped>

</style>
