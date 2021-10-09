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

            <span class="col-4 d-block d-sm-none text-dark text-truncate">Type</span>
            <div class="col-8 col-sm-2 col-md-1 text-truncate">
                <span :class="`badge badge-soft-${badgeColor}`" v-tooltip.bottom="getTxScriptText">{{getTxScriptTextShort}}</span>
            </div>

            <span class="col-4 d-block d-sm-none text-dark text-truncate">Time</span>
            <div class="col-8 col-sm-2 col-md-1 text-truncate">
                <template v-if="txInfo">
                    <span v-if="txInfo.mempool">
                        pending
                    </span>
                    <span v-else v-tooltip.bottom="`${ formatTime( $store.state.blockchain.genesisTimestamp +  txInfo.timestamp ) }`"  >
                        {{ timeAgo( $store.state.blockchain.genesisTimestamp +  txInfo.timestamp) }}
                    </span>
                </template>
            </div>

            <span class="col-4 d-block d-sm-none text-dark text-truncate">Confirmations</span>
            <div class="col-8 col-sm-1 col-md-1 text-truncate">
                <template v-if="txInfo">
                    <span v-if="txInfo.mempool">
                        pending
                    </span>
                    <span v-else v-tooltip.bottom="`${ txInfo.blkHeight }`" >
                        <router-link :to="`/explorer/block/${txInfo.blkHeight}`">
                            {{ $store.state.blockchain.end - txInfo.blkHeight }}
                        </router-link>
                    </span>
                </template>
            </div>

            <span class="col-4 d-block d-sm-none text-dark text-truncate">Data</span>
            <span class="col-8 col-sm-5 col-md-7">
                <show-transaction-preview-data :tx="tx" />
            </span>

        </template>

    </div>
</template>

<script>
import StringHelper from "../../../utils/string-helper";
import LoadingSpinner from "../../utils/loading-spinner";
import ShowTransactionPreviewData from "./show-transaction-preview-data"

export default {

    components: { LoadingSpinner, ShowTransactionPreviewData},

    props: {
        txHash: {default: null}
    },

    computed:{
        PandoraPay(){
            return PandoraPay
        },
        tx(){
            return this.$store.state.transactionsPreview.txsByHash[this.txHash]
        },
        txInfo(){
            return this.$store.state.transactionsInfo.list[this.txHash]
        },
        badgeColor(){
            return StringHelper.badgeColors(this.tx.version*10 + this.tx.base.txScript)
        },
        getTxScriptTextShort(){
            if (this.tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE){
                if (this.tx.base.txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UNSTAKE ) return "unstake"
                if (this.tx.base.txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_DELEGATE ) return "redelegate"
                if (this.tx.base.txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_CLAIM ) return "claim"
                return "simple"
            }else if (this.tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER ){
                if (this.tx.base.txScript === PandoraPay.enums.transactions.transactionZether.ScriptType.SCRIPT_TRANSFER) return "transfer"
                if (this.tx.base.txScript === PandoraPay.enums.transactions.transactionZether.ScriptType.SCRIPT_DELEGATE) return "delegate"
                return "zether"
            }
        },
        getTxScriptText(){
            if (this.tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE){
                if (this.tx.base.txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UNSTAKE ) return "unstake"
                if (this.tx.base.txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_DELEGATE ) return "update delegate"
                if (this.tx.base.txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_CLAIM ) return "claim"
                return "simple"
            }else if (this.tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER ){
                if (this.tx.base.txScript === PandoraPay.enums.transactions.transactionZether.ScriptType.SCRIPT_TRANSFER) return "private transfer"
                if (this.tx.base.txScript === PandoraPay.enums.transactions.transactionZether.ScriptType.SCRIPT_DELEGATE) return "private delegate"
                return "zether"
            }
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
