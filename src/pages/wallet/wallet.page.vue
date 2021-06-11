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
            publicKeyHash: ''
        }
    },

    computed:{

    },

    methods:{

        async loadAddress(){

            try{
                this.error = ""

                let address = this.$route.params.address
                let publicKeyHash

                if (address){
                    const addressData = await PandoraPay.addresses.decodeAddress(address)
                    const addressJSON = JSON.parse(addressData)
                    publicKeyHash = addressJSON.publicKeyHash
                } else {
                    publicKeyHash = this.$store.state.wallet.mainPublicKeyHash
                    address = this.$store.state.wallet.addresses[publicKeyHash].addressEncoded
                }

                const addressData = {}
                addressData.addressEncoded = address
                addressData.publicKeyHash = publicKeyHash

                this.$store.commit('addAddress', addressData )

                this.publicKeyHash = publicKeyHash

                await Consensus.syncPromise;

                if (!this.publicKeyHash) return

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
        const publicKeyHash = this.computedPublicKeyHash || this.publicKeyHash
        if (!this.$store.getters.walletContains(publicKeyHash))
            await Consensus.unsubscribeAccount(publicKeyHash )

    }

};
</script>

<style scoped>

</style>
