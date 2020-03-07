<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Tokens {{count ? count : ''}}</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <show-tokens-info :tokens="tokens" />

            </div>
        </div>
    </layout>

</template>

<script>

import Consensus from "src/consensus/consensus"
import Layout from "src/components/layout/layout"
import ShowTokensInfo from "src/components/explorer/show-tokens-info.vue"

export default {

    components: { Layout, ShowTokensInfo },

    data(){
        return {
            error: '',
        }
    },

    computed:{

        count(){
            return this.$store.state.tokens.count;
        },

        tokens(){
            return this.$store.state.tokens.list;
        },

    },

    methods: {

        async startDownloadingTokens() {
            await Consensus.initPromise;
            await Consensus.startDownloadingTokens();
        },

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