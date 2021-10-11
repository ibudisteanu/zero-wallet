<template>

    <layout>

        <layout-title icon="fa fa-file-invoice-dollar" title="Assets">View the existing assets.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Assets {{ count ? count : ''}}</h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3">
                <div class="card-body p-0">

                    <alert-box v-if="error" type="error">{{error}}</alert-box>

                    <show-assets-info :assets="assets" />

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

export default {

    components: { Layout, ShowAssetsInfo, LoadingButton, AlertBox, LayoutTitle},

    data(){
        return {
            error: '',
        }
    },

    computed:{

        count(){
            return this.$store.state.assets.count;
        },

        next(){
            return this.$store.state.assets.next;
        },

        assets(){
            return this.$store.state.assets.list;
        },

    },

    methods: {

        async startDownloadingAssets() {
            await this.$store.state.blockchain.syncPromise;
        },

        async handleViewMore(resolve){

        }


    },

    watch: {
        '$route' (to, from) {
            return this.startDownloadingAssets();
        }
    },

    mounted(){
        return this.startDownloadingAssets();
    },

    beforeDestroy(){
    }
}

</script>

<style scoped>

</style>
