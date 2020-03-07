<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Tokens {{count ? count : ''}}</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>


            </div>
        </div>
    </layout>

</template>

<script>

import Consensus from "src/consensus/consensus"
import Layout from "src/components/layout/layout"

export default {

    components: { Layout },

    data(){
        return {
            error: '',
        }
    },

    computed:{

        count(){
            return this.$store.state.tokens.count;
        }
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