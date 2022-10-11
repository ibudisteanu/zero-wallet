<template>

    <div class="card mb-3 h-lg-100 overflow-hidden">

        <div class="card-header bg-light">
            <div class="row align-items-center">
                <div class="col">
                    <h5 class="mb-0">
                        Pending Transactions {{txs ? txs.length : ''}}
                        <div v-if="!txs" class="py-3 text-center">
                            <loading-spinner />
                        </div>
                    </h5>
                </div>
            </div>
        </div>

        <div class="card-body px-3 py-0" v-if="txs && txs.length">
            <show-transactions-preview :transactions="txs" :public-key="publicKey"/>
        </div>

        <alert-box v-if="error" type="error">{{error}}</alert-box>

    </div>

</template>

<script>

import LoadingSpinner from "../../utils/loading-spinner";
import ShowTransactionsPreview from "src/components/explorer/tx-preview/show-transactions-preview"
import Pagination from "src/components/utils/pagination"
import AlertBox from "src/components/utils/alert-box"

export default {

    components: { LoadingSpinner, Pagination, ShowTransactionsPreview, AlertBox },

    props: {
        publicKey: {default: ""},
    },

    data(){
        return {
            error: "",
        }
    },

    computed:{

        address(){
            return this.$store.state.addresses.list[this.publicKey]
        },

        txs(){
            if (!this.$store.state.accountsPendingTxs.list[this.publicKey]) return
            return Object.keys( this.$store.state.accountsPendingTxs.list[this.publicKey] )
        },

    },

    methods: {
    },

}
</script>

<style scoped>
</style>
