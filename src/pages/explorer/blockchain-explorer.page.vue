<template>

    <layout>

        <layout-title icon="fa-cubes" title="Blockchain" >View the latest blocks.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Blockchain Explorer {{ ending ? ending : ''}}</h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3">
                <div class="card-body p-0">

                    <template v-if="!loaded">
                        <loading-spinner/>
                    </template>
                    <template v-else>

                        <show-blocks-info :blocksInfo="lastBlocksInfo" />
                        <pagination class="right pt-2" :inverted="true" :count-per-page="countPerPage" :current="page" :total="Math.ceil(ending/countPerPage)" prefix="/explorer/" suffix="#chain" />

                    </template>

                </div>

            </div>
        </div>

    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import ShowBlocksInfo from "src/components/explorer/show-blocks-info"
import Pagination from "src/components/utils/pagination"
import Consensus from "src/consensus/consensus"
import LoadingSpinner from "src/components/utils/loading-spinner";
import consts from "consts/consts"

export default {

    components: { Layout, Pagination, ShowBlocksInfo, LoadingSpinner, LayoutTitle },

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
            let page = this.$route.params.page || Math.ceil(this.ending / this.countPerPage-1)
            if (typeof page == "string"){
                page = Number.parseInt(page)
                return page;
            }
            return page
        },

        starting(){
            return this.page * this.countPerPage
        },

        lastBlocksInfo(){
            const ending = Math.min( this.ending, ( this.page + 1  ) * this.countPerPage )
            return this.$store.getters.blocksInfoSorted.filter(a => (a.height >= ending - this.countPerPage) && (a.height < ending) );
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

                const ending = Math.min( this.ending, ( this.page + 1  ) * this.countPerPage )
                await Consensus.getBlocksInfo( ending-this.countPerPage, true  )

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
