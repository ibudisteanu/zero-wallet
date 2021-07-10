<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Tokens {{count ? count : ''}}</h1>

                <alert-box v-if="error" type="error">{{error}}</alert-box>

                <show-tokens-info :tokens="tokens" />

                <div class="centered" v-if="next">
                    <loading-button class="button-width-inherit" @submit="handleViewMore" icon="fa fa-cloud-download-alt" text="View more..."/>
                </div>

            </div>
        </div>
    </layout>

</template>

<script>

import Consensus from "src/consensus/consensus"
import Layout from "src/components/layout/layout"
import ShowTokensInfo from "src/components/explorer/show-tokens-info.vue"
import LoadingButton from "src/components/utils/loading-button.vue"
import AlertBox from "src/components/utils/alert-box"

export default {

    components: { Layout, ShowTokensInfo, LoadingButton, AlertBox},

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
            await Consensus.startDownloadingTokens();
        },

        async handleViewMore(resolve){
            try {
                await Consensus._downloadTokensSpecific({index: this.next});
            }finally{
                resolve(true);
            }
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
        return Consensus.stopDownloadingTokens();
    }
}

</script>

<style scoped>

</style>
