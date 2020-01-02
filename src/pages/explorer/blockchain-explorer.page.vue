<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Blockchain Explorer</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <h3>Last blocks</h3>

                <show-blocks :blocksInfo="lastBlocksInfo" />

            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import ShowBlocks from "src/components/explorer/show-blocks"

export default {

    components: { Layout, ShowBlocks },

    data(){
        return {
            error: '',
        }
    },

    computed:{
        lastBlocksInfo(){
            return this.$store.state.blockchain.blocksInfo;
        }
    },

    methods: {


    },

}

</script>

<style scoped>

</style>