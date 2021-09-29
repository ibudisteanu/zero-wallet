<template>
    <div>
        <template v-if="!tx">
            <div>
                <span class="tx-hash">{{txHash}}</span>
                <loading-spinner/>
            </div>
        </template>
        <template v-else>

            <span class="col-3 d-block d-sm-none text-dark">Hash</span>
            <span class="col-9 col-sm-2 col-md-2 text-truncate">
                <router-link :to="`/explorer/tx/${txHash}`">
<!--                    {{tx.nonce}}-->
                    {{tx.hash}}
                </router-link>
           </span>

            <span class="col-3 d-block d-sm-none text-dark">Time</span>
            <div class="col-9 col-sm-2 col-md-1 text-truncate">
                <span v-if="tx.__mempool">
                    pending
                </span>
                <span v-else v-tooltip.bottom="`${ formatTime( $store.state.blockchain.genesisTimestamp +  tx.__timestamp ) }`"  >
                    {{ timeAgo( $store.state.blockchain.genesisTimestamp +  tx.__timestamp) }}
                </span>
            </div>

            <span class="col-3 d-block d-sm-none text-dark">Conf.</span>
            <div class="col-9 col-sm-2 col-md-1 text-truncate">
                <span v-if="tx.__mempool">
                    pending
                </span>
                <span v-else v-tooltip.bottom="`${ tx.__blkHeight }`" >
                    <router-link :to="`/explorer/block/${tx.__blkHeight}`">
                        {{ $store.state.blockchain.end - tx.__blkHeight }}
                    </router-link>
                </span>
            </div>

            <span class="col-3 d-block d-sm-none text-dark">Data</span>
            <span class="col-9 col-sm-5 col-md-7">

                <show-transaction-data :tx="tx" />

            </span>

        </template>

    </div>
</template>

<script>
import StringHelper from "../../utils/string-helper";
import LoadingSpinner from "../utils/loading-spinner";
import ShowTransactionData from "./show-transaction-data"

export default {

    components: { LoadingSpinner, ShowTransactionData},

    props: {
        txHash: {default: null}
    },

    computed:{
        tx(){
            return this.$store.state.transactions.txsByHash[this.txHash]
        },

    },

    methods:{
        timeAgo : (timestamp) => StringHelper.timeSince( timestamp*1000, false ),
        formatTime : (timestamp) => StringHelper.formatTime( timestamp*1000 ),
    },

    watch: {
        txHash:{
            immediate: true,
            handler: function (to, from) {
                if (to === from) return
                return this.$store.dispatch('getTransactionByHash', to)
            }
        },
    },
}
</script>

<style scoped>

    .tx-hash{
        display: inline-block;
    }



</style>
