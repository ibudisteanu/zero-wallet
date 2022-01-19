<template>

    <div class="card mb-3 h-lg-100 overflow-hidden">
        <div class="card-header bg-light">
            <div class="row align-items-center">
                <div class="col">
                    <h5 class="mb-0">
                        Transactions
                        <template v-if="!txs">
                            <loading-spinner />
                        </template>
                        <template v-else>
                            {{ ending }}
                        </template>
                    </h5>
                </div>
            </div>
        </div>
        <div class="card-body px-3 py-0" v-if="txs && transactions.length ">
            <show-transactions-preview :transactions="transactions"/>
        </div>
        <div class="card-footer bg-light g-0 d-block-inline p-3" v-if="pages">
            <pagination class="right" :inverted="true" :count-per-page="countPerPage" :current="finalPage" :total="pages" :prefix="`/address/${address.addressEncoded}/`" suffix="#transactions" />
        </div>

        <alert-box v-if="error" type="error">{{error}}</alert-box>

    </div>

</template>

<script>

import LoadingSpinner from "../../utils/loading-spinner";
import ShowTransactionsPreview from "src/components/explorer/tx-preview/show-transactions-preview"
import consts from "consts/consts";
import Pagination from "src/components/utils/pagination"
import AlertBox from "src/components/utils/alert-box"
import Decimal from "decimal.js"

export default {

    components: { LoadingSpinner, Pagination, ShowTransactionsPreview, AlertBox },

    props: {
        publicKey: {default: ""},
        page: {default: null},
    },

    data(){
        return {
            error: "",
            loaded: true,
        }
    },

    computed:{

        finalPage(){
            if (this.page !== null) return this.page
            return this.pages
        },

        address(){
            return this.$store.state.addresses.list[this.publicKey]
        },

        txs(){
            return this.$store.state.accountsTxs.list[this.publicKey]
        },

        countPerPage(){
            return consts.addressTxsPagination
        },

        pages(){
            return Decimal.floor(this.ending.minus(1).div(this.countPerPage) )
        },

        starting(){
            return ( this.page * this.countPerPage )
        },

        ending(){
            if (!this.txs) return new Decimal(0)
            return this.txs.count;
        },

        last(){

            if (this.page === null) return undefined

            const out = this.page.plus(1).mul( this.countPerPage )

            if (this.ending > 0)
              return Decimal.min( this.ending, out );

            return out
        },

        transactions(){

            if (!this.txs) return []

            const txs = this.txs.hashes;

            let ending = Decimal.min( this.ending, (this.page === null) ? new Decimal(2).pow(64).minus(1) : this.page.plus(1).mul( this.countPerPage) )
            let starting = Decimal.max(0 ,ending.minus( this.countPerPage ) )

            console.log("starting", starting.toString(), "ending", ending.toString() )

            const heights = []
            for ( const heightStr in txs)
                heights.push( new Decimal(heightStr) )

            heights.sort((a,b) => b.minus(a) )

            return heights.filter(  height => height.gte( starting ) && height.lt( ending) ).map( height => txs[height] );
        },


    },

    methods: {
        async loadTransactions(){
            try{
                this.loaded = false
                this.error = ''

                await this.$store.state.blockchain.syncPromise;
                await this.$store.dispatch('downloadAccountTxs', {publicKey: this.publicKey, next: this.last, view: (this.page !== null) } )

            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
            }
        }
    },

    watch: {
        publicKey (to, from) {
            return this.loadTransactions();
        },
        page (to, from) {
            return this.loadTransactions();
        },
    },

    mounted(){
        return this.loadTransactions();
    }


}
</script>

<style scoped>
</style>
