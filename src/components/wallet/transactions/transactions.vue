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
            <pagination class="right" :inverted="true" :count-per-page="countPerPage" :current="page" :total="Math.ceil(ending/countPerPage)" :prefix="`/address/${address.addressEncoded}/`" suffix="#transactions" />
        </div>
    </div>

</template>

<script>

import LoadingSpinner from "../../utils/loading-spinner";
import ShowTransactions from "src/components/explorer/show-transactions"
import consts from "../../../../consts/consts";
import Pagination from "../../utils/pagination";
import Consensus from "../../../consensus/consensus";

export default {

    components: { LoadingSpinner, Pagination, ShowTransactions },

    props: {
        publicKeyHash: {default: ""}
    },

    data(){
        return {
            error: "",
            loading: true,
        }
    },

    computed:{

        address(){
            return this.$store.state.addresses.list[this.publicKeyHash]
        },

        txs(){
            return this.$store.state.addresses.txs[this.publicKeyHash]
        },

        countPerPage(){
            return consts.addressTxsPagination
        },

        page(){
            if (!this.txs) return 0
            let page = this.$route.params.page || Math.ceil(this.ending / this.countPerPage-1)
            if (typeof page == "string"){
                page = Number.parseInt(page)
                return page;
            }
            return page
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

        transactions(){

            if (!this.txs) return []

            const txs = this.txs.list;

            const out = [];
            for (const hash of txs)
                if (this.$store.state.transactions.txsByHash[ hash ])
                    out.push( this.$store.state.transactions.txsByHash[ hash ] );
                else
                    out.push( hash  );

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
                await Consensus.syncPromise;

                console.log("Consensus.downloadAccountTxs( this.publicKeyHash, this.starting  )", this.publicKeyHash, this.starting)
                await Consensus.downloadAccountTxs( this.publicKeyHash, this.starting  )

                this.loaded = true
            }catch(err){
                this.error = err.toString()
            }
        }
    },

    watch: {
        'publicKeyHash' (to, from) {
            return this.loadTransactions();
        },
        'starting' (to, from){
            return this.loadTransactions();
        },
    },

    mounted(){
        return this.loadTransactions();
    }


}
</script>

<style scoped>

    .container{

    }

    .title{
        font-size: 20px;
    }

</style>
