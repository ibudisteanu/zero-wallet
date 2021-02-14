<template>

    <div>

        <balances :address="address"> </balances>

        
        <transactions :address="address"> </transactions>

    </div>

</template>

<script>

import Balances from "./balance/balances";
import Transactions from "src/components/wallet/transactions/transactions";

export default {

    components: {Balances, Transactions},

    computed:{
        address(){
            return this.$store.state.addresses.list[this.$store.state.wallet.mainAddress];
        }
    },

}
</script>

<style scoped>

</style>