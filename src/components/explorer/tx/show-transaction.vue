<template>
    <div>

        <template v-if="showTxInfo">
            <div class="row pb-2">
                <span class="col-5 col-sm-3 text-truncate">Height</span>
                <div class="col-7 col-sm-9 text-truncate">
                <span v-if="txInfo && txInfo.height">
                    {{txInfo.height}}
                </span>
                    <span v-else>
                    -
                </span>
                </div>
            </div>
            <div class="row pt-2 pb-2 bg-light">
                <span class="col-5 col-sm-3 text-truncate">Block Height</span>
                <div class="col-7 col-sm-9 text-truncate">
                <span v-if="txInfo && txInfo.blkHeight ">
                    <router-link :to="`/explorer/block/${txInfo.blkHeight}`">{{txInfo.blkHeight}}</router-link>
                </span>
                    <span v-else>
                    -
                </span>
                </div>
            </div>
            <div class="row pt-2 pb-2">
                <span class="col-5 col-sm-3 text-truncate">Block Timestamp</span>
                <div class="col-7 col-sm-9 text-truncate" >
                <span v-if="txInfo && txInfo.timestamp" v-tooltip.bottom="`${ formatTime( $store.state.blockchain.genesisTimestamp +  txInfo.timestamp ) }`">
                    {{timeAgo( $store.state.blockchain.genesisTimestamp + txInfo.timestamp) }}
                    <i class="fa fa-clock"></i>
                </span>
                    <span v-else>
                    -
                </span>
                </div>
            </div>
            <div class="row pt-2 pb-2 bg-light">
                <span class="col-5 col-sm-3 text-truncate">Confirmations</span>
                <div class="col-7 col-sm-9 text-truncate">
                <span v-if="txInfo && txInfo.blkHeight">
                    {{ $store.state.blockchain.end - txInfo.blkHeight -1 }}
                    <i v-if="$store.state.blockchain.end - txInfo.blkHeight -1 > 8" class="fa fa-check"></i>
                </span>
                    <span v-else>
                    -
                </span>
                </div>
            </div>
            <div class="row pt-2 pb-2">
                <span class="col-5 col-sm-3 text-truncate">Mem Pool</span>
                <span class="col-7 col-sm-9 text-truncate">{{txInfo.mempool ? 'YES': ' No' }}</span>
            </div>

        </template>

        <div class="row pt-2 pb-2 bg-light">
            <span class="col-5 col-sm-3 text-truncate">Size</span>
            <div class="col-7 col-sm-9 text-truncate">
                <span v-tooltip.bottom="`${ formatBytes(tx.size) }`"> {{formatSize(tx.size)}} </span>
            </div>
        </div>

        <div class="row pt-2 pb-2">
            <span class="col-5 col-sm-3 text-truncate">Space Extra Size</span>
            <div class="col-7 col-sm-9 text-truncate">
                <span v-tooltip.bottom="`${ formatBytes(tx.spaceExtra) }`"> {{formatSize(tx.spaceExtra)}} </span>
            </div>
        </div>

        <div class="row pt-2 pb-2 bg-light">
            <span class="col-5 col-sm-3 text-truncate">Version</span>
            <span class="col-7 col-sm-9 text-truncate">{{tx.version}}</span>
        </div>

        <template v-if="tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE" >

            <div class="row pt-2 pb-2">
                <span class="col-5 col-sm-3 text-truncate">Script Version</span>
                <span class="col-7 col-sm-9 text-truncate">
                    {{tx.txScript}} <span :class="`badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, tx.txScript)}`" v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, tx.txScript)">{{$store.getters.getTxScriptText(tx.version, tx.txScript)}}</span>
                </span>
            </div>

            <div class="row pt-2 pb-2 bg-light">
                <span class="col-5 col-sm-3 text-truncate">Nonce</span>
                <span class="col-7 col-sm-9 text-truncate">{{tx.nonce}}</span>
            </div>

            <div class="row pt-2 pb-2">
                <span class="col-5 col-sm-3 text-truncate">Fee</span>
                <span class="col-7 col-sm-9 text-truncate">{{tx.fee}}</span>
            </div>

            <div class="row pt-2 pb-2 bg-light">
                <span class="col-5 col-sm-3 text-truncate">Data</span>
                <span class="col-7 col-sm-9 text-truncate">
                    <show-transaction-data :tx="tx" />
                </span>
            </div>

            <div class="row pt-2 pb-2">
                <span class="col-5 col-sm-3 text-truncate">Extra Data</span>
                <span class="col-7 col-sm-9 text-truncate">
                                <show-transaction-data-extra :dataVersion="tx.dataVersion" :data="tx.data" />
                            </span>
            </div>

            <div class="row pt-2 pb-2  bg-light">
                <span class="col-5 col-sm-3 text-truncate">Extra Data as HEX</span>
                <span class="col-7 col-sm-9 text-truncate">{{tx.data}}</span>
            </div>

        </template>
        <template v-if="tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER">

            <div v-for="(payload, index) in tx.payloads"
                 :key="`tx_payload_${index}`" >

                <div class="row pt-2 pb-2">
                    <span class="col-5 col-sm-3 text-truncate">Payload Script Version</span>
                    <span class="col-7 col-sm-9 text-truncate">
                        {{payload.payloadScript}} <span :class="`badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, payload.payloadScript)}`" v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, payload.payloadScript)">{{$store.getters.getTxScriptText(tx.version, payload.payloadScript)}}</span>
                    </span>
                </div>

                <div class="row pt-2 pb-2  bg-light">
                    <span class="col-5 col-sm-3 text-truncate">Payload {{index}} Data</span>
                    <span class="col-7 col-sm-9">
                        <show-transaction-data :tx="tx" :id="index" />
                    </span>
                </div>

                <div class="row pt-2 pb-2 ">
                    <span class="col-5 col-sm-3 text-truncate">Payload {{index}} Extra</span>
                    <span class="col-7 col-sm-9 text-truncate">
                        <show-transaction-data-extra :dataVersion="payload.dataVersion" :data="payload.data" />
                    </span>
                </div>
                <div class="row pt-2 pb-2 bg-light">
                    <span class="col-5 col-sm-3 text-truncate">Payload {{index}} Extra HEX</span>
                    <span class="col-7 col-sm-9 text-truncate">{{payload.data}}</span>
                </div>
            </div>

        </template>
    </div>
</template>

<script>
import ShowTransactionData from "./show-transaction-data"
import ShowTransactionDataExtra from "./show-transaction-data-extra"
import StringHelper from "src/utils/string-helper";
export default {

    components: {ShowTransactionData, ShowTransactionDataExtra},

    props: {
        tx: {default: null},
        txInfo: {default: null},
        showTxInfo: {default: true},
    },

    computed:{

        PandoraPay(){
            return PandoraPay
        },

    },

    methods: {
        timeAgo : (timestamp) => StringHelper.timeSince( timestamp*1000, false ),
        formatTime : (timestamp) => StringHelper.formatTime( timestamp*1000 ),
        formatSize: (bytes) => StringHelper.formatSize(bytes, 1),
        formatBytes: (bytes) => StringHelper.formatBytes(bytes),
    }

}
</script>