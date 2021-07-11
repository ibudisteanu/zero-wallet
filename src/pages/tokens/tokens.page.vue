<template>

    <layout>

        <layout-title icon="fa fa-file-invoice-dollar" title="Tokens">View the existing tokens.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Tokens {{ count ? count : ''}}</h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3">
                <div class="card-body p-0">

                    <alert-box v-if="error" type="error">{{error}}</alert-box>

                    <show-tokens-info :tokens="tokens" />

                </div>
            </div>
        </div>

    </layout>

</template>

<script>

import Consensus from "src/consensus/consensus"
import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import ShowTokensInfo from "src/components/explorer/show-tokens-info.vue"
import LoadingButton from "src/components/utils/loading-button.vue"
import AlertBox from "src/components/utils/alert-box"

export default {

    components: { Layout, ShowTokensInfo, LoadingButton, AlertBox, LayoutTitle},

    data(){
        return {
            error: '',
        }
    },

    computed:{

        count(){
            return this.$store.state.tokens.count;
        },

        next(){
            return this.$store.state.tokens.next;
        },

        tokens(){
            return this.$store.state.tokens.list;
        },

    },

    methods: {

        async startDownloadingTokens() {
            await Consensus.syncPromise;
        },

        async handleViewMore(resolve){

        }


    },

    watch: {
        '$route' (to, from) {
            return this.startDownloadingTokens();
        }
    },

    mounted(){
        return this.startDownloadingTokens();
    },

    beforeDestroy(){
    }
}

</script>

<style scoped>

</style>
