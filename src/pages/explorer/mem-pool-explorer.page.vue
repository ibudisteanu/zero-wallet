<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Mem pool</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <template v-if="!loaded">
                    <loading-spinner />
                </template>
                <template v-else>
                    <h3>Pending Transactions: {{pendingCount}}</h3>

                    <div v-for="( _, hash ) in pendingTxs"
                         :key="`pending_${hash}`">
                        <router-link :to="`/explorer/tx/hash/${hash}`" >
                            <span> {{hash}} </span>
                        </router-link>
                    </div>
                    
                </template>

            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import Consensus from "src/consensus/consensus"
import ShowTransactions from "src/components/explorer/show-transactions"
import LoadingButton from "src/components/utils/loading-button.vue"
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

    components: { Layout, LoadingButton, LoadingSpinner },

    data(){
        return {
            error: '',
            loaded: false,
        }
    },

    computed:{
        pendingCount(){
            return this.$store.state.mempool.count
        },
        pendingTxs(){
            return this.$store.state.mempool.list
        }
    },

    methods:{

        async downloadMempool(){

            try{
                this.error = ""
                this.loaded = false

            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
            }
            await Consensus.syncPromise;
            await Consensus.downloadMempool();
        },

    },

    watch: {
        '$route' (to, from) {
            return this.downloadMempool();
        }
    },

    mounted(){
        return this.downloadMempool();
    },

    beforeDestroy(){
        //return Consensus.unsubscribePendingTransactions();
    }

}

</script>

<style scoped>

</style>
