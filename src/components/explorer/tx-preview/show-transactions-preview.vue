<template>

    <div>

        <div class="row pd-top-10 pd-bottom-10  fs--1 text-dark">
            <span class="d-none d-sm-block col-sm-2 col-md-2 text-truncate">Hash</span>
            <span class="d-none d-sm-block col-sm-2 col-md-1 text-truncate">Time</span>
            <span class="d-none d-sm-block col-sm-1 col-md-1 text-truncate">Confirmations</span>
            <span class="d-none d-sm-block col-sm-2 col-md-1 text-truncate">Type</span>
            <span class="d-none d-sm-block col-sm-5 col-md-7 text-truncate">Data</span>
        </div>

        <div id="transactions" />

        <div v-for="(tx, key) in transactions"
             :key="`show-transaction-${key}`">
            <show-transaction-preview :class="`row py-2 fs--1 align-items-center ${key % 2 === 1 ?'bg-light':''}`" :txHash="tx" />
        </div>

    </div>

</template>

<script>

import ShowTransactionPreview from "./show-transaction-preview";

export default {

    components: { ShowTransactionPreview },

    props:{
        transactions: {default: null},
    },

    methods:{

    },

    watch: {
        transactions: {
            immediate: true,
            handler: function (newVal, oldVal) {
                this.$store.commit('updateViewTransactionsPreviewHashes', {txsHashes: oldVal, insert: false } )
                this.$store.commit('updateViewTransactionsPreviewHashes', {txsHashes: newVal, insert: true } )
            }
        },
    },

    beforeDestroy() {
        this.$store.commit('updateViewTransactionsPreviewHashes', {txsHashes: this.transactions, insert: false } )
    }

}
</script>

<style scoped>
</style>
