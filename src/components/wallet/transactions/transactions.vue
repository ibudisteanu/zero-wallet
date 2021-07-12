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
            <pagination class="right" :inverted="true" :count-per-page="countPerPage" :current="finalPage" :total="Math.ceil(ending/countPerPage)" :prefix="`/address/${address.addressEncoded}/`" suffix="#transactions" />
        </div>

        <alert-box v-if="error" type="error">{{error}}</alert-box>

    </div>

</template>

<script>

import LoadingSpinner from "../../utils/loading-spinner";
import ShowTransactions from "src/components/explorer/show-transactions"
import consts from "../../../../consts/consts";
import Pagination from "../../utils/pagination";
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
            loading: true,
        }
    },

    computed:{

        finalPage(){
            if (this.page !== null) return this.page
            return Math.ceil(this.txs.count / this.countPerPage)
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
            return (this.page === null) ? undefined : ( this.page + 1 ) * this.countPerPage
        },

        transactions(){

            if (!this.txs) return []

            const txs = this.txs.hashes;

            let ending = (this.page === null) ? this.txs.count : this.last
            let starting = ending - this.countPerPage

            const out = [];
            for ( const heightStr in txs) {
                const height = Number.parseInt(heightStr)

                if (height >= starting && height < ending ){
                    console.log(height)
                    const hash = txs[height]
                    if (this.$store.state.transactions.txsByHash[ hash ])
                        out.push(this.$store.state.transactions.txsByHash[ hash ]);
                    else
                        out.push(hash);
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
                this.loading = false
                this.error = ''

                await this.$store.state.blockchain.syncPromise;
                await this.$store.dispatch('downloadAccountTxs', {publicKeyHash: this.publicKeyHash, next: this.last, view: true, updateViewPosition: (this.page === null) } )

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
