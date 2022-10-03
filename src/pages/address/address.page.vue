<template>
    <layout>

        <layout-title icon="fas fa-money-bill-alt" title="Account" >See the balance and transactions of an address.</layout-title>

        <wait-address :address="address">

            <account :address="address" />

            <wait-account :account="account">
                <balances :publicKey="publicKey" />
                <pending-transactions-preview :publicKey="publicKey" />
                <transactions-preview :public-key="publicKey" :page="page" />
            </wait-account>

            <template v-if="!isFound">
                <pending-transactions-preview :public-key="publicKey" />
            </template>

        </wait-address>

        <alert-box v-if="error" type="error">{{error}}</alert-box>

    </layout>
</template>

<script>

import Layout from "src/components/layout/layout";
import LayoutTitle from "src/components/layout/layout-title";
import Balances from "../../components/wallet/balance/balances";
import AccountIdenticon from "../../components/wallet/account/account-identicon";
import LoadingSpinner from "../../components/utils/loading-spinner";
import Account from "src/components/wallet/account/account"
import AlertBox from "src/components/utils/alert-box"
import TransactionsPreview from "../../components/wallet/transactions/transactions-preview";
import PendingTransactionsPreview from "../../components/wallet/transactions/pending-transactions-preview";
import WaitAddress from "src/components/wallet/account/wait-address";
import WaitAccount from "../../components/wallet/account/wait-account";
import UtilsHelper from "src/utils/utils-helper";

export default {

    components: {
        WaitAccount, WaitAddress, PendingTransactionsPreview, TransactionsPreview,
        Layout,  Balances, AccountIdenticon, LoadingSpinner, AlertBox, Account, LayoutTitle},

    data(){
        return {
            publicKey: '',
            error: "",
        }
    },

    computed:{

        page() {
            return UtilsHelper.getPage(this.$route.params.page)
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
                    const addressJSON = JSONParse( MyTextDecode(  await PandoraPay.addresses.decodeAddress(address) ))
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
        },

        async publicKey (to, from){
            if (to === from) return

            await this.$store.state.blockchain.syncPromise;

            if (to)
                await this.$store.dispatch('subscribeAccount', {publicKey: to} )

            if (from && !this.$store.getters.walletContains(from) )
                await this.$store.dispatch('unsubscribeAccount', from )
        }
    },

    async mounted(){
        return this.loadAddress();
    },

    async beforeUnmount() {
        if (this.publicKey && !this.$store.getters.walletContains(this.publicKey))
            await this.$store.dispatch('unsubscribeAccount', this.publicKey )
    }

};
</script>

<style scoped>

</style>
