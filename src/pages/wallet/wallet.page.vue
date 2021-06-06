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
            if (this.$route.params.parameter){
                return this.computedPublicKeyHash
            }
            return this.$store.state.wallet.mainPublicKeyHash;
        },
    },

    methods:{

        async loadAddress(){

            const parameter = this.$route.params.parameter
            if (parameter){

                if (parameter.length === 40) {
                    this.computedPublicKeyHash = parameter
                }else {
                    const addressData = await PandoraPay.addresses.decodeAddress(parameter)
                    const address = JSON.parse(addressData)
                    address.addressEncoded = parameter
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
    },

    async beforeDestroy() {
        await Consensus.unsubscribeAccount(this.publicKeyHash)
    }

};
</script>

<style scoped>

</style>
