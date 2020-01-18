<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Blockchain Explorer</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <router-link to="/explorer/pending-transactions">
                    <h3>View Pending Transactions</h3>
                </router-link>

                <h3>Last blocks forged</h3>

                <show-blocks-info :blocksInfo="lastBlocksInfo" />

            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import ShowBlocksInfo from "src/components/explorer/show-blocks-info"

export default {

    components: { Layout, ShowBlocksInfo },

    data(){
        return {
            error: '',
        }
    },

    computed:{
        lastBlocksInfo(){
            return this.$store.getters.blocksInfoSorted;
        }
    },

    methods: {


    },

}

</script>

<style scoped>

</style>