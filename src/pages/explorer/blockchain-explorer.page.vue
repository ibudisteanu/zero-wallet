<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Blockchain Explorer {{ ending ? ending : ''}}</h1>

                <router-link to="/explorer/mem-pool">
                    <h3 class="pd-bottom-30">View Mem Pool</h3>
                </router-link>

                <h3>Last blocks forged</h3>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <template v-if="!loaded">
                    <loading-spinner/>
                </template>
                <template v-else>

                    <div id="pagination">
                        <show-blocks-info :blocksInfo="lastBlocksInfo" />
                        <pagination class="right" :count-per-page="countPerPage" :current="page" :total="Math.ceil(ending/countPerPage)" :prefix="'/explorer/'" />
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

        starting(){
            return this.ending - ( this.page * this.countPerPage )
        },

        lastBlocksInfo(){
            return this.$store.getters.blocksInfoSorted.filter(a => a.height >= this.starting  && a.height <= this.ending -  ( this.page -1  ) * this.countPerPage );
        },

        ending(){
            return this.$store.state.blockchain.end;
        },

    },

    methods: {
        async loadBlocksInfo(){
            try{
                this.loading = false
                this.error = ''
                await Consensus.syncPromise;

                await Consensus.getBlocksInfo( this.starting  )

                this.loaded = true
            }catch(err){
                this.error = err.toString()
            }
        }
    },

    watch: {
        '$route' (to, from) {
            return this.loadBlocksInfo();
        },
        'starting' (to, from){
            return this.loadBlocksInfo();
        },
    },

    mounted(){
        return this.loadBlocksInfo();
    }

}

</script>

<style scoped>

</style>
