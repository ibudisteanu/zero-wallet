<template>
    <layout>

        <wallet :address="address" />

    </layout>
</template>

<script>
import Layout from "src/components/layout/layout";
import Wallet from "src/components/wallet/wallet";
import Consensus from "src/consensus/consensus"

export default {

    components: {Layout, Wallet},

    computed:{
        address(){
            return this.$route.params.address || this.$store.state.wallet.mainAddress;
        },
    },

    methods:{

        async loadAddress(){
            await Consensus.syncPromise;

            if (!this.address)
                return

            try{

            }catch(err){
                this.error = err.toString()
            }

        }

    },

    watch: {
        '$route' (to, from) {
            return this.loadAddress();
        }
    },

    async mounted(){
        return this.loadAddress();
    }


};
</script>

<style scoped>

</style>
