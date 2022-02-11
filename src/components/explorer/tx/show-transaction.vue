<template>
    <div>

        <template v-if="showTxInfo">
            <div class="row pb-2">
                <span class="col-4 col-sm-3 text-truncate">Height</span>
                <div class="col-8 col-sm-9 text-truncate">
                    <span v-if="txInfo && txInfo.height">
                        <router-link :to="`/explorer/tx/${txInfo.height}`">{{txInfo.height}}</router-link>
                    </span>
                    <span v-else>-</span>
                </div>
            </div>
            <div class="row pt-2 pb-2 bg-light">
                <span class="col-4 col-sm-3 text-truncate">Block Height</span>
                <div class="col-8 col-sm-9 text-truncate">
                    <span v-if="txInfo && txInfo.blkHeight ">
                        <router-link :to="`/explorer/block/${txInfo.blkHeight}`">{{txInfo.blkHeight}}</router-link>
                    </span>
                    <span v-else>-</span>
                </div>
            </div>
            <div class="row pt-2 pb-2">
                <span class="col-4 col-sm-3 text-truncate">Block Timestamp</span>
                <div class="col-8 col-sm-9 text-truncate" >
                    <span v-if="txInfo && txInfo.timestamp" v-tooltip.bottom="`${ formatTime( $store.state.blockchain.genesisTimestamp.plus( txInfo.timestamp )  ) }`">
                        {{timeAgo( $store.state.blockchain.genesisTimestamp.plus( txInfo.timestamp) ) }}
                        <i class="fas fa-clock"></i>
                    </span>
                    <span v-else>-</span>
                </div>
            </div>
            <div class="row pt-2 pb-2 bg-light">
                <span class="col-4 col-sm-3 text-truncate">Confirmations</span>
                <div class="col-8 col-sm-9 text-truncate">
                    <span v-if="txInfo && txInfo.blkHeight">
                        {{ $store.state.blockchain.end.minus( txInfo.blkHeight).minus( 1) }}
                        <i v-if="$store.state.blockchain.end.minus( txInfo.blkHeight ).minus(1).gt(8)" class="fas fa-check"></i>
                    </span>
                    <span v-else>-</span>
                </div>
            </div>
            <div class="row pt-2 pb-2">
                <span class="col-4 col-sm-3 text-truncate">Mem Pool</span>
                <span class="col-8 col-sm-9 text-truncate">{{txInfo.mempool ? 'YES': ' No' }}</span>
            </div>

        </template>

        <div class="row pt-2 pb-2 bg-light">
            <span class="col-4 col-sm-3 text-truncate">Size</span>
            <div class="col-8 col-sm-9 text-truncate">
                <span v-tooltip.bottom="`${ formatBytes(tx.size.toNumber()) }`"> {{formatSize(tx.size.toNumber())}} </span>
            </div>
        </div>

        <div class="row pt-2 pb-2">
            <span class="col-4 col-sm-3 text-truncate">Space Extra Size</span>
            <div class="col-8 col-sm-9 text-truncate">
                <span v-tooltip.bottom="`${ formatBytes(tx.spaceExtra.toNumber()) }`"> {{formatSize(tx.spaceExtra.toNumber())}} </span>
            </div>
        </div>

        <div class="row pt-2 pb-2 bg-light">
            <span class="col-4 col-sm-3 text-truncate">Version</span>
            <span class="col-8 col-sm-9 text-truncate">
                {{tx.version}} <span :class="`badge badge-soft-${$store.getters.getTxVersionBadgeColor(tx.version)}`" v-tooltip.bottom="$store.getters.getTxVersionText(tx.version)">{{$store.getters.getTxVersionText(tx.version)}}</span>
            </span>
        </div>

        <template v-if="tx.version.eq(PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE)" >

            <div class="row pt-2 pb-2">
                <span class="col-4 col-sm-3 text-truncate">Script Version</span>
                <span class="col-8 col-sm-9 text-truncate">
                    {{tx.txScript}} <span :class="`badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, tx.txScript)}`" v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, tx.txScript)">{{$store.getters.getTxScriptText(tx.version, tx.txScript)}}</span>
                </span>
            </div>

            <div class="row pt-2 pb-2 bg-light">
                <span class="col-4 col-sm-3 text-truncate">Nonce</span>
                <span class="col-8 col-sm-9 text-truncate">{{tx.nonce}}</span>
            </div>

            <div class="row pt-2 pb-2">
                <span class="col-4 col-sm-3 text-truncate">Fee</span>
                <span class="col-8 col-sm-9 text-truncate">{{tx.fee}}</span>
            </div>

            <div class="row pt-2 pb-2 bg-light">
                <span class="d-none d-sm-inline col-12 col-sm-3 text-truncate">Data</span>
                <span class="col-12 col-sm-9 text-truncate">
                    <show-transaction-data :tx="tx" />
                </span>
            </div>

            <div class="row pt-2 pb-2">
                <span class="col-12 col-sm-3 text-truncate">Message (Memo)</span>
                <span class="col-12 col-sm-9 text-truncate" v-tooltip.bottom="`${Buffer.from(tx.data, 'hex').toString()}`">
                    {{Buffer.from(tx.data, "hex").toString()}}
                </span>
            </div>

            <div class="row pt-2 pb-2  bg-light">
                <span class="col-4 col-sm-3 text-truncate">Message (Memo) as HEX</span>
                <span class="col-8 col-sm-9 text-truncate">{{tx.data}}</span>
            </div>

        </template>
        <template v-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER)">

            <div v-for="(payload, index) in tx.payloads"
                 :key="`tx_payload_${index}`" >

                <div class="row pt-2 pb-2">
                    <span class="col-4 col-sm-3 fw-medium text-truncate">Payload {{index}}</span>
                    <span class="col-8 col-sm-9 text-truncate"></span>
                </div>

                <template v-if="payload.asset !== PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX">
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-4 col-sm-3 text-truncate">Fee Rate</span>
                        <span class="col-8 col-sm-9 text-truncate">{{payload.feeRate}}</span>
                    </div>

                    <div class="row pt-2 pb-2">
                        <span class="col-4 col-sm-3 text-truncate">Fee Leading Zeros</span>
                        <span class="col-8 col-sm-9 text-truncate">{{payload.feeLeadingZeros}}</span>
                    </div>

                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-4 col-sm-3 text-truncate">Fee Conversion Rate</span>
                        <span class="col-8 col-sm-9 text-truncate">{{ payload.feeRate.div( new Decimal(10).pow( payload.feeLeadingZeros ) ) }}</span>
                    </div>
                </template>

                <div class="row pt-2 pb-2 bg-light">
                    <span class="col-4 col-sm-3 text-truncate">Asset</span>
                    <span class="col-8 col-sm-9 text-truncate">
                        <router-link :to="`/explorer/asset/${payload.asset}`">
                            {{payload.asset}}
                        </router-link>
                    </span>
                </div>

                <div class="row pt-2 pb-2">
                    <span class="col-4 col-sm-3 text-truncate">Script Version</span>
                    <span class="col-8 col-sm-9 text-truncate">
                        {{payload.payloadScript}} <span :class="`badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, payload.payloadScript)}`" v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, payload.payloadScript)">{{$store.getters.getTxScriptText(tx.version, payload.payloadScript)}}</span>
                    </span>
                </div>

                <div class="row pt-2 pb-2 bg-light">
                    <span class="col-12 col-sm-3 text-truncate">Data</span>
                    <span class="col-12 col-sm-9">
                        <show-transaction-data :tx="tx" />
                    </span>
                </div>

                <div class="row pt-2 pb-2">
                    <span class="col-4 col-sm-3 text-truncate">Memo</span>
                    <span class="col-8 col-sm-9">
                        <template v-if="payload.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_PLAIN_TEXT)">
                            <span class="text-truncate" v-tooltip.bottom="`${Buffer.from(payload.data, 'hex').toString()}`">{{Buffer.from(payload.data, "hex").toString()}}</span>
                        </template>
                        <template v-if="payload.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_ENCRYPTED)">
                            <span v-if="!decrypted">?</span>
                            <span v-else class="text-truncate" v-tooltip.bottom="`${Buffer.from(decrypted.zetherTx.payloads[index].message, 'hex').toString()}`">{{Buffer.from(decrypted.zetherTx.payloads[index].message, "hex").toString()}}</span>
                        </template>
                    </span>
                </div>
                <div class="row pt-2 pb-2 bg-light">
                    <span class="col-4 col-sm-3 text-truncate">Memo in HEX</span>
                    <span class="col-8 col-sm-9 text-truncate" v-tooltip.bottom="`${payload.data}`">{{payload.data}}</span>
                </div>

                <div class="row pt-2 pb-2">
                    <span class="col-4 col-sm-3 text-truncate">Amount</span>
                    <span class="col-8 col-sm-9">
                        <span v-if="!decrypted">?</span>
                        <amount v-else-if="decrypted.zetherTx.payloads[index].whisperSenderValid" :value="decrypted.zetherTx.payloads[index].sentAmount" :sign="false" value-class="text-danger" />
                        <amount v-else-if="decrypted.zetherTx.payloads[index].whisperRecipientValid" :value="decrypted.zetherTx.payloads[index].receivedAmount" :sign="true" value-class="text-success" />
                    </span>
                </div>

                <div class="row pt-2 pb-2 bg-light">
                    <span class="col-4 col-sm-3 text-truncate">Recipient</span>
                    <span class="col-8 col-sm-9">
                        <span v-if="!decrypted || !decrypted.zetherTx.payloads[index].recipientPublicKey">?</span>
                        <account-identicon v-else :publicKey="decrypted.zetherTx.payloads[index].recipientPublicKey" size="21" outer-size="7" />
                    </span>
                </div>

            </div>

        </template>

        <div v-for="(fee,index) in fees" :key="`fee_${index}`">
            <div class="row pt-2 pb-2">
                <span class="col-4 col-sm-3 fw-medium text-truncate">Fee{{ (fees.length > 1) ? index : ''}}</span>
                <span class="col-8 col-sm-9 text-truncate">
                    <amount :asset="fee.asset" :value="fee.amount" value-class="text-900 text-danger" :sign="false" />
                    <template v-if="fee.amountNative">
                        => <amount :value="fee.amountNative" value-class="text-900" :sign="true" />
                    </template>
                </span>
            </div>
        </div>

        <loading-button v-if="canDecrypt && !decrypted" type="button"  v-tooltip.bottom="`Decrypt the transaction to see the amount, shared text and recipient`" @submit="decryptTx" text="Decrypt" icon="fas fa-unlock" :icon-left="false" class-custom="btn btn-falcon-primary btn-sm" />

    </div>
</template>

<script>
import ShowTransactionData from "./show-transaction-data"
import StringHelper from "src/utils/string-helper";
import Decimal from "decimal.js"
import Amount from "src/components/wallet/amount"
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import LoadingButton from "src/components/utils/loading-button";

export default {

    components: {ShowTransactionData, Amount, AccountIdenticon, LoadingButton},

    props: {
        tx: {default: null},
        txInfo: {default: null},
        showTxInfo: {default: true},
    },

    data(){
        return {
            decrypted: null,
        }
    },

    computed:{

        PandoraPay: () => PandoraPay,
        Decimal: () => Decimal,
        Buffer: () => Buffer,

        fees(){
            if (!this.tx) return []

            if (this.tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ){
                return [ {amount: this.tx.fee, asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX, feeRate: 1 } ]
            }else if (this.tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER) ) {

                const out = []
                for (const payload of this.tx.payloads)
                    out.push({
                        amount: payload.statement.fee,
                        amountNative: payload.asset !== PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX ? payload.statement.fee.mul(payload.feeRate).div(new Decimal(10).pow(payload.feeLeadingZeros)) : null,
                        asset: payload.asset,
                        feeRate: payload.feeRate
                    })

                return out
            }

        },

        publicKey(){
            return this.$store.state.wallet.mainPublicKey
        },

        canDecrypt(){
            if (!this.tx || !this.publicKey) return false

            if (this.tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER) ) {
                for (const payload of this.tx.payloads)
                    for (const publicKey of payload.statement.publickeylist)
                        if (publicKey === this.publicKey)
                            return true
            }
        },

    },

    methods: {
        timeAgo : (timestamp) => StringHelper.timeSince( timestamp*1000, false ),
        formatTime : (timestamp) => StringHelper.formatTime( timestamp*1000 ),
        formatSize: (bytes) => StringHelper.formatSize(bytes, 1),
        formatBytes: (bytes) => StringHelper.formatBytes(bytes),

        async decryptTx(resolve){
            const decrypted = await this.$store.dispatch('decryptTx', {hash: this.tx.hash, publicKey: this.publicKey})
            if (decrypted) this.decrypted = decrypted
            resolve(true)
        },

        loadTxDecrypted(txHash, publicKey){
            const decrypted = localStorage.getItem(`txDecrypted:${txHash}:${publicKey}`)
            if (decrypted) this.decrypted = JSONParse(decrypted)
            else this.decrypted = null
        }

    },

    watch: {
        tx:{
            immediate: true,
            handler: function (to, from) {
                if (to === from) return
                return this.loadTxDecrypted(to.hash, this.publicKey)
            }
        },
        publicKey: {
            immediate: true,
            handler: function (to, from) {
                if (to === from) return
                return this.loadTxDecrypted(this.tx.hash, to)
            }
        },
    },

}
</script>