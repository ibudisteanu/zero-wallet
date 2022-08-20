<template>

    <layout>

        <layout-title icon="fas fa-file-invoice-dollar" title="Transaction">View a transaction.</layout-title>

        <div v-if="!tx" class="card-body p-3 fs--1">
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <div class="row align-items-center">
                        <div class="col">
                            <h5 class="mb-0 text-truncate">
                                Block Explorer {{height ? height : $base64ToHex(hash) }}
                            </h5>
                        </div>
                    </div>
                </div>
                <div class="card-body p-3 fs--1">
                    <alert-box v-if="error" type="error">{{error}}</alert-box>
                    <div v-if="!loaded" class="py-3 text-center"> <loading-spinner class="fs-2" /> </div>
                </div>
            </div>
        </div>

        <template v-else>
            <show-transaction :tx="tx" :tx-info="txInfo" />
        </template>

    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import LoadingSpinner from "src/components/utils/loading-spinner";
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import Amount from "src/components/wallet/amount"
import AlertBox from "src/components/utils/alert-box"
import LoadingButton from "src/components/utils/loading-button";
import ShowTransaction from "src/components/explorer/tx/show-transaction"
import Decimal from "decimal.js"

export default {

    components: { LoadingButton, Layout, LoadingSpinner, AccountIdenticon, Amount, AlertBox, LayoutTitle, ShowTransaction},

    data(){
        return {
            error: '',
            loaded: false,
        }
    },

    computed:{

        query(){
            return (this.$route.params.query||'').toLowerCase();
        },
        height(){
            try{
                if (this.query && this.query.length < 10) return new Decimal(this.query)
            }catch(err){
            }
        },
        hash(){
            if (this.query && this.query.length === 2*PandoraPay.cryptography.HASH_SIZE) return Buffer.from(this.query, "hex").toString("base64")
        },
        tx(){
            if (this.height) return this.$store.state.transactions.txsByHeight[this.height];
            if (this.hash) return this.$store.state.transactions.txsByHash[this.hash];
        },
        txInfo(){
            if (this.tx) return this.$store.state.transactionsInfo.txsByHash[this.tx.hash]
        },

        PandoraPay: () => PandoraPay,

    },

    methods: {

        JSONStringify: (a, b, c) => JSONStringify(a, b, c),

        async loadTransaction(){

            try{
                this.loaded = false;
                this.error = ""

                if (!this.height && !this.hash)
                    throw 'Tx height/hash was not specified';

                await this.$store.state.blockchain.syncPromise;

                if (this.tx)
                    await this.removed()

                if (this.height) await this.$store.dispatch('getTransactionByHeight', this.height);
                if (this.hash ) await this.$store.dispatch('getTransactionByHash', this.hash );

                if (this.tx) {
                    this.$store.commit('updateViewTransactionsHashes', {txsHashes: [this.tx.hash], insert: true} )
                    await this.$store.dispatch('subscribeTransaction', {txId: this.tx.hash} )
                }

            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
            }

        },

        async removed(tx = this.tx){
            this.$store.commit('updateViewTransactionsHashes', {txsHashes: [tx.hash], insert: false} )
            await this.$store.dispatch('unsubscribeTransaction', tx.hash )
        },

    },

    watch: {
        '$route': {
            handler: async function (to, from ) {
                if (to === from) return
                return this.loadTransaction();
            },
        },

        async hash(to, from) {
          if (from === to) return

            const tx = this.$store.state.transactions.txsByHash[from];
            if (tx) return this.removed(tx)
        },

        async height(to, from){
            if (from === to) return

            const tx = this.$store.state.transactions.txsByHeight[from];
            if (tx) return this.removed(tx)
        },

    },

    mounted(){
        return this.loadTransaction();
    },

    beforeUnmount() {
        if (this.tx) return this.removed()
    },

}
</script>

<style scoped>

    .input, .output{
        display: inline-block;
    }

    .amount{
        display: inline-block;
    }

</style>
