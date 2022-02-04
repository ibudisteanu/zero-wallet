<template>

    <div>

        <div class="d-none d-sm-flex row bg-200 text-900 py-2 fs--1 fw-semi-bold">
            <span class="d-none d-sm-block col-sm-2 col-md-2 text-truncate">Hash</span>
            <span class="d-none d-sm-block col-sm-2 col-md-1 text-truncate">Time</span>
            <span class="d-none d-sm-block col-sm-2 col-md-1 text-truncate">Confirmations</span>
            <span class="d-none d-md-block col-md-1 text-truncate">Fee</span>
            <span class="d-none d-sm-block col-sm-2 col-md-1 text-truncate">Type</span>
            <span class="d-none d-sm-block col-sm-4 col-md-6 text-truncate">Data</span>
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
                if (newVal === oldVal) return
                this.$store.commit('updateViewTransactionsPreviewHashes', {txsHashes: oldVal && newVal ? oldVal.filter( hash => newVal.indexOf(hash) === -1 ) : oldVal, insert: false } )
                this.$store.commit('updateViewTransactionsPreviewHashes', {txsHashes: newVal && oldVal ? newVal.filter( hash => oldVal.indexOf(hash) === -1 ) : newVal, insert: true } )
            }
        },
    },

    beforeUnmount() {
        this.$store.commit('updateViewTransactionsPreviewHashes', {txsHashes: this.transactions, insert: false } )
    }

}
</script>

<style scoped>
</style>
