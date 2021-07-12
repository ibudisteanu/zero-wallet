<template>
    <layout>

        <layout-title icon="fa-money-bill-alt" title="Account" >See the balance and transactions of an address.</layout-title>

        <template v-if="address">

            <account :address="address" />

            <alert-box v-if="!isLoading && !isFound" type="warning" >
                Address doesn't exist!
            </alert-box>

            <balances :publicKeyHash="publicKeyHash" />
            <transactions :publicKeyHash="publicKeyHash" :page="page" />

        </template>
        <template class="py-3" v-else>
            <loading-spinner />
        </template>
    </layout>
</template>

<script>
import Layout from "src/components/layout/layout";
import LayoutTitle from "src/components/layout/layout-title";
import Balances from "../../components/wallet/balance/balances";
import Transactions from "../../components/wallet/transactions/transactions";
import AccountIdenticon from "../../components/wallet/account/account-identicon";
import LoadingSpinner from "../../components/utils/loading-spinner";
import Account from "src/components/wallet/account/account"
import AlertBox from "src/components/utils/alert-box"

export default {

    components: {Layout,  Balances, Transactions, AccountIdenticon, LoadingSpinner, AlertBox, Account, LayoutTitle},

    data(){
        return {
            publicKeyHash: ''
        }
    },

    computed:{

        page(){
            let page = this.$route.params.page
            if (typeof page == "string"){
                page = Number.parseInt(page)
                return page;
            }
            return page
        },

        address(){
            return this.$store.state.addresses.list[this.publicKeyHash];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKeyHash]
        },
        mainPublicKeyHash(){
            return this.$store.state.wallet.mainPublicKeyHash
        },
        isLoading(){
            return this.account === undefined
        },
        isFound(){
            return this.account !== null
        },

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

                await this.$store.state.blockchain.syncPromise;

                if (!this.publicKeyHash) return

                await this.$store.dispatch('subscribeAccount', this.publicKeyHash )

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
            await this.$store.dispatch('_unsubscribeAccount', publicKeyHash )

    }

};
</script>

<style scoped>

</style>
