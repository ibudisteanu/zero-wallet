<template>

    <div class="card mb-3 h-lg-100 overflow-hidden">

        <div class="card-header bg-light">
            <div class="row align-items-center">
                <div class="col">
                    <h5 class="mb-0">
                        Pending Transactions {{txs ? txs.length : ''}}
                        <template v-if="!txs">
                            <loading-spinner />
                        </template>
                    </h5>
                </div>
            </div>
        </div>

        <div class="card-body p-3" v-if="txs && txs.length">
            <show-transactions :transactions="txs"/>
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
    },

    data(){
        return {
            error: "",
        }
    },

    computed:{

        address(){
            return this.$store.state.addresses.list[this.publicKeyHash]
        },

        txs(){
            if (!this.$store.state.accountsPendingTxs.list[this.publicKeyHash]) return
            return Object.keys( this.$store.state.accountsPendingTxs.list[this.publicKeyHash] )
        },

    },

    methods: {
    },

}
</script>

<style scoped>
</style>
