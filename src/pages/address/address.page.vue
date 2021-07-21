<template>
    <layout>

        <layout-title icon="fa-money-bill-alt" title="Account" >See the balance and transactions of an address.</layout-title>

        <template v-if="address">

            <account :address="address" />

            <alert-box v-if="!isLoading && !isFound" type="warning" >
                Address doesn't exist!
            </alert-box>
            <template v-else>
                <balances :publicKeyHash="publicKeyHash" />
                <transactions :publicKeyHash="publicKeyHash" :page="page" />
            </template>

        </template>
        <div class="py-3 text-center" v-else>
            <loading-spinner class="fs-3" />
        </div>

        <alert-box v-if="error" type="error">{{error}}</alert-box>

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
            publicKeyHash: '',
            error: "xxxx",
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

        async loadAddress(newAddress){

            try{

                this.error = ""

                let address = this.$route.params.address
                let publicKeyHash

                if (address){
                    const addressData = await PandoraPay.addresses.decodeAddress(address)
                    const addressJSON = JSON.parse(addressData)
                    publicKeyHash = addressJSON.publicKeyHash
                } else {
                    publicKeyHash = newAddress||this.mainPublicKeyHash
                    if (!this.$store.state.wallet.addresses[publicKeyHash]) return
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
                console.error(err)
            }

        }

    },

    watch: {
        $route (to, from) {
            return this.loadAddress();
        },
        async mainPublicKeyHash (to, from){

            if (to !== this.publicKeyHash || !this.publicKeyHash)
                await this.loadAddress(to);

            if (!this.$store.getters.walletContains(from) && from !== to)
                await this.$store.dispatch('unsubscribeAccount', from )
        },
    },

    async mounted(){
        return this.loadAddress();
    },

    async beforeDestroy() {
        if (!this.$store.getters.walletContains(this.publicKeyHash))
            await this.$store.dispatch('unsubscribeAccount', this.publicKeyHash )

    }

};
</script>

<style scoped>

</style>
