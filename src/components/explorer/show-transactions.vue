<template>

    <div>

        <div class="row pd-top-10 pd-bottom-10  fs--1 text-dark">
            <span class="d-none d-sm-block col-md-2 text-truncate">Hash</span>
            <span class="d-none d-md-block col-md-1 text-truncate">Time</span>
            <span class="d-none d-sm-block col-md-1 text-truncate">Confirmations</span>
            <span class="d-none d-sm-block col-md-7 text-truncate">Data</span>
        </div>

        <div id="transactions" />

        <div v-for="(tx, key) in transactions"
             :key="`show-transaction-${key}`">
            <show-transaction :class="`row py-2 fs--1 align-items-center ${key % 2 === 1 ?'bg-light':''}`" :txHash="tx" />
        </div>

    </div>

</template>

<script>

import ShowTransaction from "./show-transaction";

export default {

    components: {ShowTransaction },

    props:{
        transactions: {default: null},
    },

    methods:{

    },

    mounted(){
        this.$store.commit('updateViewTransactionsHashes', {txsHashes: this.transactions, insert: true } )
    },

    beforeDestroy() {
        this.$store.commit('updateViewTransactionsHashes', {txsHashes: this.transactions, insert: false } )
    }

}
</script>

<style scoped>
</style>
