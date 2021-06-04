<template>
    <layout>
        <wallet :public-key-hash="publicKeyHash" />
    </layout>
</template>

<script>
import Layout from "src/components/layout/layout";
import Wallet from "src/components/wallet/wallet";
import Consensus from "src/consensus/consensus"

export default {

    components: {Layout, Wallet},

    data(){
        return {
            computedPublicKeyHash: ''
        }
    },

    computed:{
        publicKeyHash(){
            if (this.$route.params.publicKeyHash){
                return this.computedPublicKeyHash
            }
            return this.$store.state.wallet.mainPublicKeyHash;
        },
    },

    methods:{

        async loadAddress(){

            if (this.$route.params.publicKeyHash){
                if (this.$route.params.publicKeyHash.length === 40) {
                    this.computedPublicKeyHash = this.$route.params.publicKeyHash
                }else {
                    const addressData = await PandoraPay.addresses.decodeAddress(this.$route.params.publicKeyHash)
                    const address = JSON.parse(addressData)
                    this.$store.commit('addAddress', address)
                    this.computedPublicKeyHash = address.publicKeyHash
                }
            }

            await Consensus.syncPromise;

            if (!this.publicKeyHash)
                return

            try{
                await Consensus.subscribeAccount( this.publicKeyHash )
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
