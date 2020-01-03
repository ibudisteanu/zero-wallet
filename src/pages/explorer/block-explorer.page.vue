<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Block Explorer</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <h3>Block {{ block ? block.toJSON() : '' }}</h3>


            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import ShowBlocksInfo from "src/components/explorer/show-blocks-info"
import Consensus from "src/consensus/consensus"

export default {

    components: { Layout, ShowBlocksInfo },

    data(){
        return {
            error: '',
        }
    },

    computed:{
        height(){
            return this.$route.params.height;
        },
        hash(){
            return this.$route.params.hash;
        },

        block(){

            if (this.height) return this.$store.state.blockchain.blocks[this.height];
            if (this.hash) return this.$store.state.blockchain.blocksByHash[this.hash];
        }
    },

    methods: {
    },

    async mounted(){

        if (this.height === undefined && !this.hash){
            this.error = 'Block index was not specified';
            return;
        }

        if (this.height !== undefined)  return Consensus.getBlock(this.height);
        else
        if (this.hash ) return Consensus.getBlockByHash(this.hash);

    }

}

</script>

<style scoped>

</style>