<template>

    <div>

        <div class="row pd-top-10 pd-bottom-10  fs--1 text-dark">
            <span class="d-none d-sm-block col-sm-2 col-md-2 text-truncate">Hash</span>
            <span class="d-none d-sm-block col-sm-2 col-md-1 text-truncate">Time</span>
            <span class="d-none d-sm-block col-sm-2 col-md-1 text-truncate">Confirmations</span>
            <span class="d-none d-sm-block col-sm-5 col-md-8 text-truncate">Data</span>
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

    watch: {
        transactions: {
            immediate: true,
            handler: function (newVal, oldVal) {
                this.$store.commit('updateViewTransactionsHashes', {txsHashes: oldVal, insert: false } )
                this.$store.commit('updateViewTransactionsHashes', {txsHashes: newVal, insert: true } )
            }
        },
    },

    beforeDestroy() {
        this.$store.commit('updateViewTransactionsHashes', {txsHashes: this.transactions, insert: false } )
    }

}
</script>

<style scoped>
</style>
