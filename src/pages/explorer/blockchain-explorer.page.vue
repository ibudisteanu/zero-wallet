<template>

    <layout>

        <layout-title icon="fas fa-cubes" title="Blockchain">View the latest blocks.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Blockchain Explorer {{ ending ? ending : '' }}</h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 pt-0">
                <div class="card-body p-0">

                    <alert-box v-if="error" class="w-100 mt-2" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''" >{{error}}</alert-box>

                    <template v-if="!loaded" >
                        <div class="py-3 text-center">
                            <loading-spinner />
                        </div>
                    </template>
                    <template v-else>
                        <show-blocks-info :blocksInfo="lastBlocksInfo"/>
                    </template>

                </div>

                <div class="card-footer" v-if="loaded">
                    <pagination class="py-0" :inverted="true" :count-per-page="countPerPage" :current="finalPage"
                                :total="pages" prefix="/explorer/" suffix="#chain"/>
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
import AlertBox from "src/components/utils/alert-box"

export default {

    components: {Layout, Pagination, ShowBlocksInfo, LoadingSpinner, LayoutTitle, AlertBox},

    data() {
        return {
            error: '',
            loaded: false,
        }
    },

    computed: {

        countPerPage() {
            return consts.blocksInfoPagination
        },

        finalPage() {
            if (this.page !== null) return this.page
            return Math.floor((this.ending - 1) / this.countPerPage)
        },

        pages() {
            return Math.floor((this.ending - 1) / this.countPerPage)
        },

        page() {
            let page = this.$route.params.page || null
            if (typeof page == "string") {
                try{
                    page = Number.parseInt(page)
                    if (isNaN(page)) throw "error"
                }catch(err){
                    this.error = "Invalid page number"
                    return null
                }
            }
            return page
        },

        starting() {
            return this.page * this.countPerPage
        },

        last() {

            const out = (this.finalPage + 1) * this.countPerPage
            if (this.ending > 0)
                return Math.min(this.ending, out);

            return out
        },

        lastBlocksInfo() {
            return this.$store.getters.blocksInfoSorted.filter(a => (a.height >= this.last - this.countPerPage) && (a.height < this.last));
        },

        ending() {
            return this.$store.state.blockchain.end;
        },

    },

    methods: {
        async loadBlocksInfo() {
            try {
                this.loaded = false
                this.error = ''

                await this.$store.state.blockchain.syncPromise;

                await this.$store.dispatch('getBlocksInfo', {
                    starting: this.last - this.countPerPage,
                    blockchainEnd: this.ending,
                    view: this.page !== null
                })

            } catch (err) {
                this.error = err.toString()
            } finally {
                this.loaded = true
            }
        }
    },

    watch: {
        '$route'(to, from) {
            return this.loadBlocksInfo();
        },
    },

    mounted() {
        return this.loadBlocksInfo();
    }

}

</script>

<style scoped>

</style>
