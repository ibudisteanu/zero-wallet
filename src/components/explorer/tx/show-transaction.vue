<template>
    <div>

        <template v-if="showTxInfo">
            <div class="row pb-2">
                <span class="col-5 col-sm-3 text-truncate">Height</span>
                <div class="col-7 col-sm-9 text-truncate">
                    <span v-if="txInfo && txInfo.height">
                        <router-link :to="`/explorer/tx/${txInfo.height}`">{{txInfo.height}}</router-link>
                    </span>
                    <span v-else>-</span>
                </div>
            </div>
            <div class="row pt-2 pb-2 bg-light">
                <span class="col-5 col-sm-3 text-truncate">Block Height</span>
                <div class="col-7 col-sm-9 text-truncate">
                    <span v-if="txInfo && txInfo.blkHeight ">
                        <router-link :to="`/explorer/block/${txInfo.blkHeight}`">{{txInfo.blkHeight}}</router-link>
                    </span>
                    <span v-else>-</span>
                </div>
            </div>
            <div class="row pt-2 pb-2">
                <span class="col-5 col-sm-3 text-truncate">Block Timestamp</span>
                <div class="col-7 col-sm-9 text-truncate" >
                    <span v-if="txInfo && txInfo.timestamp" v-tooltip.bottom="`${ formatTime( $store.state.blockchain.genesisTimestamp.plus( txInfo.timestamp )  ) }`">
                        {{timeAgo( $store.state.blockchain.genesisTimestamp.plus( txInfo.timestamp) ) }}
                        <i class="fas fa-clock"></i>
                    </span>
                    <span v-else>-</span>
                </div>
            </div>
            <div class="row pt-2 pb-2 bg-light">
                <span class="col-5 col-sm-3 text-truncate">Confirmations</span>
                <div class="col-7 col-sm-9 text-truncate">
                    <span v-if="txInfo && txInfo.blkHeight">
                        {{ $store.state.blockchain.end.minus( txInfo.blkHeight).minus( 1) }}
                        <i v-if="$store.state.blockchain.end.minus( txInfo.blkHeight ).minus(1).gt(8)" class="fas fa-check"></i>
                    </span>
                    <span v-else>-</span>
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
                <span v-tooltip.bottom="`${ formatBytes(tx.size.toNumber()) }`"> {{formatSize(tx.size.toNumber())}} </span>
            </div>
        </div>

        <div class="row pt-2 pb-2">
            <span class="col-5 col-sm-3 text-truncate">Space Extra Size</span>
            <div class="col-7 col-sm-9 text-truncate">
                <span v-tooltip.bottom="`${ formatBytes(tx.spaceExtra.toNumber()) }`"> {{formatSize(tx.spaceExtra.toNumber())}} </span>
            </div>
        </div>

        <div class="row pt-2 pb-2 bg-light">
            <span class="col-5 col-sm-3 text-truncate">Version</span>
            <span class="col-7 col-sm-9 text-truncate">
                {{tx.version}} <span :class="`badge badge-soft-${$store.getters.getTxVersionBadgeColor(tx.version)}`" v-tooltip.bottom="$store.getters.getTxVersionText(tx.version)">{{$store.getters.getTxVersionText(tx.version)}}</span>
            </span>
        </div>

        <template v-if="tx.version.eq(PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE)" >

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
                    <show-transaction-data-extra :data-version="tx.dataVersion" :data="tx.data" />
                </span>
            </div>

            <div class="row pt-2 pb-2  bg-light">
                <span class="col-5 col-sm-3 text-truncate">Extra Data as HEX</span>
                <span class="col-7 col-sm-9 text-truncate">{{tx.data}}</span>
            </div>

        </template>
        <template v-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER)">

            <div v-for="(payload, index) in tx.payloads"
                 :key="`tx_payload_${index}`" >

                <div class="row pt-2 pb-2">
                    <span class="col-5 col-sm-3 fw-medium text-truncate">Payload {{index}}</span>
                    <span class="col-7 col-sm-9 text-truncate"></span>
                </div>

                <template v-if="payload.asset !== PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX">
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Fee Rate</span>
                        <span class="col-7 col-sm-9 text-truncate">{{payload.feeRate}}</span>
                    </div>

                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Fee Leading Zeros</span>
                        <span class="col-7 col-sm-9 text-truncate">{{payload.feeLeadingZeros}}</span>
                    </div>

                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Fee Conversion Rate</span>
                        <span class="col-7 col-sm-9 text-truncate">{{ computeFeeRate(payload) }}</span>
                    </div>

                </template>

                <div class="row pt-2 pb-2 bg-light">
                    <span class="col-5 col-sm-3 text-truncate">Asset</span>
                    <span class="col-7 col-sm-9 text-truncate">
                        <router-link :to="`/explorer/asset/${payload.asset}`">
                            {{payload.asset}}
                        </router-link>
                    </span>
                </div>

                <div class="row pt-2 pb-2">
                    <span class="col-5 col-sm-3 text-truncate">Script Version</span>
                    <span class="col-7 col-sm-9 text-truncate">
                        {{payload.payloadScript}} <span :class="`badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, payload.payloadScript)}`" v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, payload.payloadScript)">{{$store.getters.getTxScriptText(tx.version, payload.payloadScript)}}</span>
                    </span>
                </div>

                <div class="row pt-2 pb-2 bg-light">
                    <span class="col-5 col-sm-3 text-truncate">Data</span>
                    <span class="col-7 col-sm-9">
                        <show-transaction-data :tx="tx" :id="index" />
                    </span>
                </div>

                <div class="row pt-2 pb-2">
                    <span class="col-5 col-sm-3 text-truncate">Extra</span>
                    <span class="col-7 col-sm-9 text-truncate">
                        <show-transaction-data-extra :data-version="payload.dataVersion" :data="payload.data" />
                    </span>
                </div>
                <div class="row pt-2 pb-2 bg-light">
                    <span class="col-5 col-sm-3 text-truncate">Extra HEX</span>
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
import Decimal from "decimal.js"

export default {

    components: {ShowTransactionData, ShowTransactionDataExtra},

    props: {
        tx: {default: null},
        txInfo: {default: null},
        showTxInfo: {default: true},
    },

    computed:{

        PandoraPay: () => PandoraPay,

    },

    methods: {
        timeAgo : (timestamp) => StringHelper.timeSince( timestamp*1000, false ),
        formatTime : (timestamp) => StringHelper.formatTime( timestamp*1000 ),
        formatSize: (bytes) => StringHelper.formatSize(bytes, 1),
        formatBytes: (bytes) => StringHelper.formatBytes(bytes),

        computeFeeRate(payload){
            return payload.feeRate.div( new Decimal(10).pow( payload.feeLeadingZeros ) )
        }

    }

}
</script>