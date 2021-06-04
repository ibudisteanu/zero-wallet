<template>

    <div>

        <div class="container">
            <div class="boxed  pd-top-30 pd-bottom-30">

                <span class="bold pd-bottom-20"> Account Details </span>
                <div class="balance-title">
                    <account-identicon :address="address" :size="40" :outer-size="8" />
                    <div>
                        <span>Account</span>
                        <span class="bold">{{address}}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!account" class="container">
            <div class="boxed centered pd-top-30 pd-bottom-30">
                <loading-spinner />
            </div>
        </div>

        <template v-if="account">
            <balances :address="account"> </balances>
            <transactions :address="account"> </transactions>
        </template>

    </div>

</template>

<script>

import Balances from "./balance/balances";
import Transactions from "src/components/wallet/transactions/transactions";
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

    components: {Balances, Transactions, AccountIdenticon, LoadingSpinner},

    props: {
        address: {default: ""}
    },

    computed:{
        account(){
            return this.$store.state.addresses.list[this.address];
        }
    },

    data(){
        return {
        }
    },

    mounted(){
    }

}
</script>

<style scoped>

    .title{
    }

    .balance-title{
        display: grid;
        grid-template-columns: 80px 1fr;
        grid-column-gap: 10px;
    }

</style>
