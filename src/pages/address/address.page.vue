<template>
    <layout>

        <layout-title icon="fa-money-bill-alt" title="Account" >See the balance and transactions of an address.</layout-title>

        <template v-if="address">

            <account :address="address" />

            <template v-if="!isLoading">

                <template v-if="!isFound">
                    <alert-box type="warning" >
                        Address doesn't exist (is empty)!
                    </alert-box>
                    <pending-transactions :publicKey="publicKey" />
                </template>
                <template v-else>
                    <balances :publicKey="publicKey" />
                    <pending-transactions :publicKey="publicKey" />
                    <transactions :publicKey="publicKey" :page="page" />
                </template>

            </template>

        </template>

        <div class="py-3 text-center" v-if="!address || isLoading">
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
import PendingTransactions from "../../components/wallet/transactions/pending-transactions";

export default {

    components: {
        PendingTransactions,
        Layout,  Balances, Transactions, AccountIdenticon, LoadingSpinner, AlertBox, Account, LayoutTitle},

    data(){
        return {
            publicKey: '',
            error: "",
        }
    },

    computed:{

        page(){
            let page = this.$route.params.page || null
            if (typeof page == "string"){
                page = Number.parseInt(page)
                return page;
            }
            return page
        },

        address(){
            if (this.$store.state.wallet.addresses[this.publicKey])
                return this.$store.state.wallet.addresses[this.publicKey];
            return this.$store.state.addresses.list[this.publicKey];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        mainPublicKey(){
            return this.$store.state.wallet.mainPublicKey
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
                let publicKey

                if (address){
                    const addressData = await PandoraPay.addresses.decodeAddress(address)
                    const addressJSON = JSON.parse( MyTextDecode(addressData))
                    publicKey = addressJSON.publicKey
                } else {
                    publicKey = newAddress||this.mainPublicKey
                    if (!this.$store.state.wallet.addresses[publicKey]) return
                    address = this.$store.state.wallet.addresses[publicKey].addressEncoded
                }

                const addressData = {}
                addressData.addressEncoded = address
                addressData.publicKey = publicKey

                this.$store.commit('addAddress', addressData )

                this.publicKey = publicKey

                await this.$store.state.blockchain.syncPromise;

                if (!this.publicKey) return

                await this.$store.dispatch('subscribeAccount', this.publicKey )

            }catch(err){
                this.error = err.toString()
                console.error(err)
            }

        }

    },

    watch: {
        $route (to, from) {
          if (to === from) return
            return this.loadAddress();
        },
        async mainPublicKey (to, from){

            if (to === from) return

            if (to !== this.publicKey || !this.publicKey)
                await this.loadAddress(to);

            if (!this.$store.getters.walletContains(from) )
                await this.$store.dispatch('unsubscribeAccount', from )
        },
    },

    async mounted(){
        return this.loadAddress();
    },

    async beforeDestroy() {
        if (!this.$store.getters.walletContains(this.publicKey))
            await this.$store.dispatch('unsubscribeAccount', this.publicKey )

    }

};
</script>

<style scoped>

</style>
