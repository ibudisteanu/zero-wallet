<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Pending Transactions</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <h3>Last Pending Transactions</h3>

                <show-transactions-info :transactionsInfo="transactionsInfo" />

            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import ShowTransactionsInfo from "src/components/explorer/show-transactions-info"

export default {

    components: { Layout, ShowTransactionsInfo },

    data(){
        return {
            error: '',
        }
    },

    computed:{
        lastPendingTransactions(){
            return this.$store.getters.blocksInfoSorted;
        }
    },

    methods: {


    },

}

</script>

<style scoped>

</style>