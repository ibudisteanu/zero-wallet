<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Pending Transactions {{pendingCount}}</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <h3>Last Pending Transactions</h3>

                <show-transactions :transactions="pendingTransactions"/>

                <div class="centered" v-if="pendingNext" >
                    <span class="pointer" @click="handleViewMore">View more...</span>
                </div>

            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import Consensus from "src/consensus/consensus"
import ShowTransactions from "src/components/explorer/show-transactions"
export default {

    components: { Layout, ShowTransactions },

    data(){
        return {
            error: '',
        }
    },

    computed:{

        pendingCount(){
            return this.$store.state.transactions.pendingCount;
        },

        pending(){
            return this.$store.state.transactions.pending;
        },

        pendingTransactions(){

            const txs = this.pending;

            const out = [];
            for (const hash in txs)
                if (this.$store.state.transactions.list[ hash ])
                    out.push( this.$store.state.transactions.list[ hash ] );

            return out;
        },

        pendingNext(){
            return this.$store.state.transactions.pendingNext;
        }

    },

    methods:{
        async startDownloadPendingTransactions(){
            await Consensus.initPromise;
            await Consensus.startDownloadPendingTransactions();
        },

        handleViewMore(){
            return Consensus.downloadPendingTransactions( undefined, this.pendingNext )
        }

    },

    watch: {
        '$route' (to, from) {
            return this.startDownloadPendingTransactions();
        }
    },

    mounted(){
        return this.startDownloadPendingTransactions();
    },

    beforeDestroy(){
        return Consensus.stopDownloadPendingTransactions();
    }

}

</script>

<style scoped>

</style>