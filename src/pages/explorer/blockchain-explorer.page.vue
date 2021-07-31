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
                    </template>

                </div>

                <div class="card-footer" v-if="loaded">
                    <pagination class="py-0" :inverted="true" :count-per-page="countPerPage" :current="page" :total="pages" prefix="/explorer/" suffix="#chain" />
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

        pages(){
          return Math.floor((this.ending-1)/this.countPerPage)
        },

        page(){
            let page = this.$route.params.page || this.pages
            if (typeof page == "string"){
                page = Number.parseInt(page)
                return page;
            }
            return page
        },

        starting(){
            return this.page * this.countPerPage
        },

        last(){
            return Math.min( this.ending, ( this.page + 1  ) * this.countPerPage )
        },

        lastBlocksInfo(){
            return this.$store.getters.blocksInfoSorted.filter(a => (a.height >= this.last - this.countPerPage) && (a.height < this.last) );
        },

        ending(){
            return this.$store.state.blockchain.end;
        },

    },

    methods: {
        async loadBlocksInfo(){
            try{
                this.loaded = false
                this.error = ''

                await this.$store.state.blockchain.syncPromise;

                await this.$store.dispatch('getBlocksInfo', { starting: this.last-this.countPerPage, blockchainEnd: this.$store.state.blockchain.end, view: this.page !== this.pages } )

            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
            }
        }
    },

    watch: {
        '$route' (to, from) {
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
