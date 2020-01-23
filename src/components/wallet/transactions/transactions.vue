<template>

    <div class="container">

        <div class="boxed boxed-background">

            <div v-if="address">

                <span class="title">Transactions {{ txCount + txCountPending }}</span>  <br/>

                <loading-spinner v-if="!address.loaded" />

                <div v-else>

                    <show-transactions :transactions="transactionsAll "/>

                    <div class="centered">
                        <span v-if="address.txsLowestIndex" class="pointer" @click="handleViewMore">View more...</span>
                    </div>

                </div>
            </div>


        </div>

    </div>

</template>

<script>

import LoadingSpinner from "../../utils/loading-spinner";
import ShowTransactions from "src/components/explorer/show-transactions"
import Consensus from "src/consensus/consensus"

export default {

    components: { LoadingSpinner, ShowTransactions},

    props: {
        address: null
    },

    computed:{

        txCount(){
            return this.address.txCount;
        },

        txCountPending(){
            return this.address.txCountPending;
        },

        txs(){
            return this.address.txs;
        },

        pendingTxs(){
            return this.address.pendingTxs;
        },

        pendingTransactions(){

            const txs = this.pendingTxs;

            const out = [];
            for (const key in txs)
                if (this.$store.state.transactions.list[txs[key]])
                    out.push( this.$store.state.transactions.list[txs[key]] );

                return out;
        },

        transactions(){
            const txs = this.txs;

            const out = [];
            for (const key in txs)
                if (this.$store.state.transactions.list[txs[key]])
                    out.push( this.$store.state.transactions.list[txs[key]] );

            return out.sort ( (a,b) => b.__extra.height - a.__extra.height );
        },

        transactionsAll(){
            return this.pendingTransactions.concat( this.transactions );
        }

    },

    methods:{
        handleViewMore(){
            return Consensus.downloadAccountTransactionsSpecific( {account: this.address.address, index: this.address.txsLowestIndex, limit: 10} )

        }
    }

}
</script>

<style scoped>

    .container{

    }

    .title{
        font-size: 20px;
    }

</style>