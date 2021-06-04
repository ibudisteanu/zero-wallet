<template>

    <div v-if="address">

        <div class="container">
            <div class="boxed pd-top-30 pd-bottom-30">

                <span class="bold pd-bottom-20"> Account Details </span>
                <div class="balance-title">
                    <account-identicon :public-key-hash="publicKeyHash" :size="40" :outer-size="8" />
                    <div>
                        <span>Account</span>
                        <span class="bold">{{address.addressEncoded}}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!address.loaded" class="container">
            <div class="boxed centered ">
                <loading-spinner />
            </div>
        </div>
        <template v-else>
            <balances :address="address"> </balances>
            <transactions :address="address"> </transactions>
        </template>


    </div>
    <div v-else>
        <div class="container">
            <div class="boxed centered pd-top-30 pd-bottom-30">
                <loading-spinner />
            </div>
        </div>
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
        publicKeyHash: {default: ""}
    },

    computed:{
        address(){
            return this.$store.state.addresses.list[this.publicKeyHash];
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
