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
        <div class="card-body p-3" v-if="txs && transactionsAll.length ">
            <show-transactions :transactions="transactionsAll"/>
        </div>
        <div class="card-footer bg-light g-0 d-block-inline p-3" v-if="pages">
            <pagination class="right" :inverted="true" :count-per-page="countPerPage" :current="finalPage" :total="pages" :prefix="`/address/${address.addressEncoded}/`" suffix="#transactions" />
        </div>

        <alert-box v-if="error" type="error">{{error}}</alert-box>

    </div>

</template>

<script>

import LoadingSpinner from "../../utils/loading-spinner";
import ShowTransactions from "src/components/explorer/show-transactions"
import consts from "../../../../consts/consts";
import Pagination from "src/components/utils/pagination"
import AlertBox from "src/components/utils/alert-box"

export default {

    components: { LoadingSpinner, Pagination, ShowTransactions, AlertBox },

    props: {
        publicKeyHash: {default: ""},
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
            return Math.floor((this.ending-1)/this.countPerPage)
        },

        address(){
            return this.$store.state.addresses.list[this.publicKeyHash]
        },

        txs(){
            return this.$store.state.accounts.txs[this.publicKeyHash]
        },

        countPerPage(){
            return consts.addressTxsPagination
        },

        pages(){
            return Math.floor((this.ending-1)/this.countPerPage)
        },

        starting(){
            return ( this.page * this.countPerPage )
        },

        ending(){
            if (!this.txs) return 0
            return this.txs.count;
        },

        pendingTransactions(){
            return [];
        },

        last(){
            const out = (this.page === null) ? undefined : ( this.page + 1 ) * this.countPerPage
            if (this.ending > 0)
              return Math.min( this.ending, out );

            return out
        },

        transactions(){

            if (!this.txs) return []

            const txs = this.txs.hashes;

            let ending = Math.min( this.ending, (this.page === null) ? Number.MAX_SAFE_INTEGER : ( this.page + 1 ) * this.countPerPage)
            let starting = ending - this.countPerPage

            console.log("starting", starting, "ending", ending)

            const heights = []
            for ( const heightStr in txs)
                heights.push( Number.parseInt(heightStr) )

            heights.sort((a,b) => b-a)

            const out = [];
            for (const height of heights ) {
              console.log("height",height, !!txs[height], ending)
              if (height >= starting && height < ending) {
                  out.push(txs[height]);
                }
            }

            return out;
        },

        transactionsAll(){
            return this.pendingTransactions.concat( this.transactions );
        },

    },

    methods: {
        async loadTransactions(){
            try{
                this.loaded = false
                this.error = ''

                await this.$store.state.blockchain.syncPromise;
                await this.$store.dispatch('downloadAccountTxs', {publicKeyHash: this.publicKeyHash, next: this.last, view: (this.page !== null) } )

            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
            }
        }
    },

    watch: {
        publicKeyHash (to, from) {
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
