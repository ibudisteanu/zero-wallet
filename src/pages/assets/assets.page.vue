<template>

    <layout>

        <layout-title icon="fa fa-file-invoice-dollar" title="Assets">View the existing assets on the network.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Assets Explorer {{ ending ? ending : ''}}</h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 pt-0 ">
                <div class="card-body p-0">

                    <alert-box v-if="error" type="error">{{error}}</alert-box>

                    <template v-if="!loaded">
                        <loading-spinner  />
                    </template>
                    <template v-else>
                        <show-assets-info id="assets" :assetsInfo="assetsInfo" />
                    </template>

                </div>
                <div class="card-footer" v-if="loaded">
                    <pagination class="py-0" :inverted="true" :count-per-page="countPerPage" :current="finalPage"
                                :total="pages" prefix="/explorer/assets/" suffix="#assets" ></pagination>
                </div>
            </div>
        </div>

    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import ShowAssetsInfo from "src/components/explorer/show-assets-info"
import LoadingButton from "src/components/utils/loading-button"
import AlertBox from "src/components/utils/alert-box"
import consts from "consts/consts";
import Pagination from "src/components/utils/pagination";
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

    components: {Pagination, Layout, ShowAssetsInfo, LoadingButton, AlertBox, LayoutTitle, LoadingSpinner},

    data(){
        return {
            error: '',
            loaded: false,
        }
    },

    computed:{

        countPerPage() {
            return consts.assetsInfoPagination
        },

        finalPage() {
            if (this.page !== null) return this.page
            return 0
        },

        ending(){
            return this.$store.state.blockchain.assets;
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

        assetsInfo(){
            return this.$store.state.assetsInfo.listByHeight;
        },

    },

    methods: {

        async loadAssetsInfo() {
            try {
                this.loaded = false
                this.error = ''

                await this.$store.state.blockchain.syncPromise;

                await this.$store.dispatch('getAssetsInfo', {
                    start: this.finalPage * this.countPerPage,
                    end: this.finalPage * (this.countPerPage+1),
                    count: this.ending
                })

            } catch (err) {
                this.error = err.toString()
            } finally {
                this.loaded = true
            }
        },

        async handleViewMore(resolve){

        }


    },

    watch: {
        '$route' (to, from) {
            return this.loadAssetsInfo();
        }
    },

    mounted(){
        return this.loadAssetsInfo();
    },

    beforeDestroy(){
    }
}

</script>

<style scoped>

</style>
