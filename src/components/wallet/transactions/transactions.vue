<template>

    <div class="container">

        <div class="boxed boxed-background">

            <div v-if="address">

                <span class="title">Transactions {{ txCount }}</span>

                <loading-spinner v-if="!address.loaded" />

                <div v-else>

                    <show-transactions :transactions="transactions"/>

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

        txs(){
            return this.address.txs;
        },

        transactions(){
            const txs = this.txs;

            const out = [];
            for (const key in txs)
                if (this.$store.state.transactions.list[txs[key]])
                    out.push( this.$store.state.transactions.list[txs[key]] );

            return out.sort ( (a,b) => b.__extra.height - a.__extra.height );
        }

    },

    methods:{
        handleViewMore(){
            return Consensus.downloadAccountTransactionsSpecific(this.address.address, this.address.txsLowestIndex )

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