<template>
    <div>
        <template v-if="!tx">
            <div>
                <span class="tx-hash">{{txHash}}</span>
                <loading-spinner/>
            </div>
        </template>
        <template v-else>

            <span class="col-4 d-block d-sm-none text-dark text-truncate">Hash</span>
            <span class="col-8 col-sm-2 col-md-2 text-truncate">
                <router-link :to="`/explorer/tx/${txHash}`">
                    {{tx.hash}}
                </router-link>
           </span>

            <span class="col-4 d-block d-sm-none text-dark text-truncate">Time</span>
            <div class="col-8 col-sm-2 col-md-1 text-truncate">
                <template v-if="txInfo">
                    <span v-if="txInfo.mempool">
                        <i class="fas fa-clock" />
                    </span>
                    <span v-else-if="txInfo.timestamp" v-tooltip.bottom="`${ formatTime( $store.state.blockchain.genesisTimestamp.plus(  txInfo.timestamp ) ) }`"  >
                        {{ timeAgo( $store.state.blockchain.genesisTimestamp.plus( txInfo.timestamp ) ) }}
                    </span>
                </template>
            </div>

            <span class="col-4 d-block d-sm-none text-dark text-truncate">Confirmations</span>
            <div class="col-8 col-sm-2 col-md-1 text-truncate">
                <template v-if="txInfo">
                    <span v-if="txInfo.mempool">
                        <i class="fas fa-clock" />
                    </span>
                    <span v-else-if="txInfo.blkHeight" v-tooltip.bottom="`${ txInfo.blkHeight }`" >
                        <router-link :to="`/explorer/block/${txInfo.blkHeight}`">
                            {{ $store.state.blockchain.end.minus( txInfo.blkHeight ) }}
                        </router-link>
                    </span>
                </template>
            </div>

            <span class="col-4 d-xs-none d-sm-none d-md-none text-dark text-truncate">Fees</span>
            <div class="col-8 d-xs-none d-sm-none d-md-block  col-md-1 text-truncate">
                <amount :value="tx.fee" :sign="true" :show-asset="false "/>
            </div>

            <span class="col-4 d-block d-sm-none text-dark text-truncate">Type</span>
            <div class="col-8 col-sm-2 col-md-1 text-truncate">
                <template v-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE )">
                    <span :class="`badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, tx.base.txScript)}`" v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, tx.base.txScript)">{{$store.getters.getTxScriptTextShort(tx.version, tx.base.txScript)}}</span>
                </template>
                <template v-else-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER )">
                    <span v-for="(payload, index) in tx.base.payloads"
                          :key="`tx_type_${index}`">
                        <span :class="`badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, payload.payloadScript)}`" v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, payload.payloadScript)">{{$store.getters.getTxScriptTextShort(tx.version, payload.payloadScript)}}</span>
                    </span>
                </template>
            </div>

            <span class="col-4 d-block d-sm-none text-dark text-truncate">Data</span>
            <span class="col-8 col-sm-4 col-md-6">
                <show-transaction-preview-data :tx="tx" />
            </span>

        </template>

    </div>
</template>

<script>
import StringHelper from "src/utils/string-helper";
import LoadingSpinner from "src/components/utils/loading-spinner";
import ShowTransactionPreviewData from "./show-transaction-preview-data"
import Amount from "src/components/wallet/amount"

export default {

    components: { LoadingSpinner, ShowTransactionPreviewData, Amount},

    props: {
        txHash: {default: null}
    },

    computed:{
        PandoraPay: () => PandoraPay,
        tx(){
            return this.$store.state.transactionsPreview.txsByHash[this.txHash]
        },
        txInfo(){
            return this.$store.state.transactionsInfo.list[this.txHash]
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
                return this.$store.dispatch('getTransactionPreviewByHash', to)
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
