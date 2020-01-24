<template>

    <div>

        <balance :address="address"> </balance>
        <transactions :address="address"> </transactions>

    </div>

</template>

<script>

import Balance from "./balance/balance";
import Transactions from "./transactions/transactions";

export default {

    components: {Balance, Transactions},

    computed:{
        address(){
            return this.$store.state.addresses.list[this.$store.state.wallet.mainAddress];
        }
    },

}
</script>

<style>

</style>