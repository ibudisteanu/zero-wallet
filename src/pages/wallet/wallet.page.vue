<template>
    <layout>
        <div v-if="address">

            <account :account="address" />

            <balances :publicKeyHash="publicKeyHash" />
            <transactions :publicKeyHash="publicKeyHash" />

        </div>
        <div v-else>
            <div class="container">
                <div class="boxed centered pd-top-30 pd-bottom-30">
                    <loading-spinner />
                </div>
            </div>
        </div>
    </layout>
</template>

<script>
import Layout from "src/components/layout/layout";
import Consensus from "src/consensus/consensus"
import Balances from "../../components/wallet/balance/balances";
import Transactions from "../../components/wallet/transactions/transactions";
import AccountIdenticon from "../../components/wallet/account/account-identicon";
import LoadingSpinner from "../../components/utils/loading-spinner";
import Account from "src/components/wallet/account/account"

export default {

    components: {Layout,  Balances, Transactions, AccountIdenticon, LoadingSpinner, Account},

    data(){
        return {
            publicKeyHash: ''
        }
    },

    computed:{
        address(){
            return this.$store.state.addresses.list[this.mainPublicKeyHash];
        },
        account(){
            return this.$store.state.addresses.accounts[this.mainPublicKeyHash]
        },
        mainPublicKeyHash(){
            return this.$store.state.wallet.mainPublicKeyHash
        }
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
                    publicKeyHash = this.mainPublicKeyHash
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
        },
        'mainPublicKeyHash' (to, from){
            if (this.mainPublicKeyHash && (from === this.publicKeyHash || !this.publicKeyHash) )
                return this.loadAddress();

        },
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
