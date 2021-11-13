<template>

    <layout>

        <layout-title icon="fa fa-file-invoice-dollar" title="Transaction" >View a transaction.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0 text-truncate">Tx {{height ? height : hash}}</h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 fs--1">

                <alert-box v-if="error" type="error">{{error}}</alert-box>

                <template v-if="!loaded">
                    <loading-spinner/>
                </template>
                <div v-else-if="tx">
                    <show-transaction :tx="tx" :tx-info="txInfo"/>
                </div>


            </div>

        </div>

        <div class="card mb-3" v-if="tx">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">JSON Transaction {{tx.__height}}  </h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-0 fs--1">
                <textarea class="form-control form-control-sm fs--2" rows="10">{{tx}}</textarea>
            </div>
        </div>

    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import LoadingSpinner from "src/components/utils/loading-spinner";
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import StringHelper from "src/utils/string-helper"
import Amount from "src/components/wallet/amount"
import AlertBox from "src/components/utils/alert-box"
import LoadingButton from "src/components/utils/loading-button";
import ShowTransaction from "src/components/explorer/tx/show-transaction"

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
            if (this.query && this.query.length < 10)
                return Number.parseInt(this.query)
        },
        hash(){
            if (this.query && this.query.length === 64)
                return this.query
        },

        tx(){
            if (this.height !== undefined) return this.$store.state.transactions.txsByHeight[this.height];
            if (this.hash) return this.$store.state.transactions.txsByHash[this.hash];
        },
        txInfo(){
            if (this.tx) return this.$store.state.transactionsInfo.list[this.tx.hash]
        },

        PandoraPay(){
            return PandoraPay
        },

    },

    methods: {

        async loadTransaction(){

            try{
                this.loaded = false;
                this.error = ""

                if (this.height === undefined && !this.hash)
                    throw 'Tx height/hash was not specified';

                await this.$store.state.blockchain.syncPromise;

                if (this.tx)
                    await this.removed()

                if (this.height !== undefined) await this.$store.dispatch('getTransactionByHeight', this.height);
                if (this.hash ) await this.$store.dispatch('getTransactionByHash', this.hash);

                if (this.tx) {
                    this.$store.commit('updateViewTransactionsHashes', {txsHashes: [this.tx.hash], insert: true} )
                    await this.$store.dispatch('subscribeTransaction', this.tx.hash )
                }

            }catch(err){
                this.error = err.toString()
                console.log(err)

            }finally{
                this.loaded = true
            }

        },

        async removed(tx = this.tx){
            this.$store.commit('updateViewTransactionsHashes', {txsHashes: [tx.hash], insert: false} )
            await this.$store.dispatch('unsubscribeTransaction', tx.hash )
        },

        async handleDecryptExtraData(resolver){
            try{

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                await this.$store.dispatch('decryptTxData', {tx: this.tx, password, commitNow: true })

            }finally{
                resolver()
            }
        }

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

          this.$store.commit('updateViewTransactionsHashes', {txsHashes: [from], insert: false } )
          await this.$store.dispatch('unsubscribeTransaction', from )
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

    beforeDestroy() {
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
