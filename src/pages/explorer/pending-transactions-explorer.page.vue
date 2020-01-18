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
import Consensus from "src/consensus/consensus"

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

    methods:{
        async startDownloadPendingTransactions(){
            await Consensus.initPromise;
            await Consensus.startDownloadPendingTransactions();
        }
    },

    watch: {
        '$route' (to, from) {
            return this.startDownloadPendingTransactions();
        }
    },

    async mounted(){

        return this.startDownloadPendingTransactions();

    },

    beforeDestroy(){
        await Consensus.stopDownloadPendingTransactions();
    }

}

</script>

<style scoped>

</style>