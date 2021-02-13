<template>

    <div class="container">

        <div class="boxed boxed-background">

            <div v-if="address">

                <span class="title row pd-bottom-20">TRANSACTIONS {{ !address.loaded ? '' : txCount + txCountPending }}</span>

                <loading-spinner v-if="!address.loaded" />

                <div v-else>

                    <show-transactions :transactions="transactionsAll "/>

                    <div class="centered" v-if="address.txsLowestIndex">
                        <loading-button class="button-width-inherit" @submit="handleViewMore" icon="fa fa-cloud-download-alt" text="View more..."/>
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
import LoadingButton from "src/components/utils/loading-button.vue"

export default {

    components: { LoadingSpinner, ShowTransactions, LoadingButton},

    props: {
        address: {default: null}
    },

    computed:{

        txCount(){
            return this.address.txCount || 0;
        },

        txCountPending(){
            return this.address.txCountPending || 0;
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

        async handleViewMore(resolve){

            try{
                await Consensus.downloadAccountTransactionsSpecific( {account: this.address.address, index: this.address.txsLowestIndex, limit: 10} )
            }finally{
                resolve(true);
            }


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