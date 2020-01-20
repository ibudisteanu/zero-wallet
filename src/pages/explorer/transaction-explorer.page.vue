<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Transaction Explorer</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <div v-if="!error">

                    <h3>Transaction {{height ? height : hash}} </h3>

                    <div v-if="!tx">
                        <loading-spinner/>
                    </div>
                    <div v-else>
                        <div class="table">
                            <div class="table-row">
                                <span>Hash</span>
                                <span>{{tx.hash().toString("hex")}}</span>
                            </div>
                            <div class="table-row">
                                <span>Block Height</span>
                                <span>{{tx.__data.height}}</span>
                            </div>
                            <div class="table-row">
                                <span>Confirmations</span>
                                <span>{{ $store.state.blockchain.end - tx.__data.height -1 }}</span>
                            </div>

                        </div>

                    </div>

                </div>


            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import Consensus from "src/consensus/consensus"
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

    components: {Layout, Consensus, LoadingSpinner},

    computed:{

        height(){
            return this.$route.params.height;
        },
        hash(){
            return this.$route.params.hash;
        },

        tx(){

            let tx;
            if (this.height) tx = this.$store.state.transactions.listByHeight[this.height];
            if (this.hash) tx = this.$store.state.transactions.list[this.hash];

            return tx;

        },

    },

    methods: {

        async loadTransaction(){

            if (this.height === undefined && !this.hash){
                this.error = 'Tx index was not specified';
                return;
            }

            await Consensus.initPromise;

            if (this.height !== undefined)  return Consensus.getTransaction(this.height);
            if (this.hash ) return Consensus.getTransactionByHash(this.hash);

        },

    },

    watch: {
        '$route' (to, from) {
            return this.loadTransaction();
        }
    },

    async mounted(){

        return this.loadTransaction();

    }

}
</script>

<style>

    .table-row{
        grid-template-columns: 200px 1fr;
    }

</style>