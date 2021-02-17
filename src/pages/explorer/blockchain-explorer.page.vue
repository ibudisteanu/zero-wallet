<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Blockchain Explorer {{ ending ? ending : ''}}</h1>

                <router-link to="/explorer/pending-transactions">
                    <h3>View Pending Transactions</h3>
                </router-link>

                <h3>Last blocks forged</h3>

                <show-blocks-info :blocksInfo="lastBlocksInfo" />

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                {{next}}
                <div class="centered" v-if="next">
                    <loading-button class="button-width-inherit" @submit="handleViewMore" icon="fa fa-cloud-download-alt" text="View more..."/>
                </div>

            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import ShowBlocksInfo from "src/components/explorer/show-blocks-info"
import LoadingButton from "src/components/utils/loading-button.vue"
import Consensus from "src/consensus/consensus"

export default {

    components: { Layout, ShowBlocksInfo, LoadingButton },

    data(){
        return {
            error: '',
        }
    },

    computed:{
        lastBlocksInfo(){
            return this.$store.getters.blocksInfoSorted;
        },

        ending(){
            return this.$store.state.blockchain.end;
        },

        next(){
            return this.$store.state.blockchain.next;
        }
    },

    methods: {

        async handleViewMore(resolver){

            try{
                await Consensus.downloadBlocksHashes(Math.max(this.next-10, 0), this.next)
            }catch(err){
                console.error(err)
            }finally{
                resolver(true);
            }

        }

    },

}

</script>

<style scoped>

</style>