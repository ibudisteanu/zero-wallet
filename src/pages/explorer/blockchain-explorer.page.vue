<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Blockchain Explorer</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <h3>Last blocks</h3>

                <show-blocks :blocksHashes="lastBlocksHashes" />

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
        lastBlocksHashes(){
            return this.$store.state.blockchain.blocksHashes;
        }
    },

    methods: {


    },

}

</script>

<style scoped>

</style>