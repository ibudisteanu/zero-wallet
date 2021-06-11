<template>

    <div class="container">
        <div class="boxed boxed-background">

            <span class="title row pd-bottom-20">
                TRANSACTIONS
                <template v-if="!address.txs">
                    <loading-spinner />
                </template>
                <template v-else>
                    {{txCount + txCountPending}}
                </template>
            </span>

            <show-transactions :transactions="transactionsAll"/>

        </div>

    </div>

</template>

<script>

import LoadingSpinner from "../../utils/loading-spinner";
import ShowTransactions from "src/components/explorer/show-transactions"
import Consensus from "src/consensus/consensus"
import LoadingButton from "src/components/utils/loading-button.vue"

export default {

    components: { LoadingSpinner, ShowTransactions },

    props: {
        address: {default: null}
    },


    computed:{

        txCount(){
            return this.address.txs.count || 0;
        },

        txCountPending(){
            return 0;
        },

        pendingTransactions(){
            return [];
        },

        transactions(){

            if (!this.address.txs)
                return []

            const txs = this.address.txs.list;

            const out = [];
            for (const key in txs)
                if (this.$store.state.transactions.txsByHash[txs[key]])
                    out.push( this.$store.state.transactions.txsByHash[txs[key]] );

            return out;
        },

        transactionsAll(){
            return this.pendingTransactions.concat( this.transactions );
        }

    },

    methods:{

        async handleViewMore(resolve){

        }
    },


}
</script>

<style scoped>

    .container{

    }

    .title{
        font-size: 20px;
    }

</style>
