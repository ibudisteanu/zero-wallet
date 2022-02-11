<template>
    <div>
        <template v-if="!tx">
            <div>
                <span class="tx-hash">{{txHash}}</span>
                <loading-spinner/>
            </div>
        </template>
        <template v-else>

            <span class="col-4 d-block d-md-none text-dark text-truncate">Hash</span>
            <span class="col-8 col-md-1 text-truncate">
                <router-link :to="`/explorer/tx/${txHash}`">
                    {{tx.hash}}
                </router-link>
           </span>

            <span class="col-4 d-block d-md-none text-dark text-truncate">Time</span>
            <div class="col-8 col-md-1 text-truncate">
                <template v-if="txInfo">
                    <span v-if="txInfo.mempool" class="d-md-flex justify-content-center align-items-center">
                        <i class="fas fa-clock" />
                    </span>
                    <span v-else-if="txInfo.timestamp" v-tooltip.bottom="`${ formatTime( $store.state.blockchain.genesisTimestamp.plus(  txInfo.timestamp ) ) }`" class="d-md-flex justify-content-center align-items-center"  >
                        {{ timeAgo( $store.state.blockchain.genesisTimestamp.plus( txInfo.timestamp ) ) }}
                    </span>
                </template>
            </div>

            <span class="col-4 d-block d-md-none text-dark text-truncate">Confirmations</span>
            <div class="col-8 col-md-1 text-truncate">
                <template v-if="txInfo">
                    <span v-if="txInfo.mempool" class="d-md-flex justify-content-center align-items-center">
                        <i class="fas fa-clock" />
                    </span>
                    <span v-else-if="txInfo.blkHeight" v-tooltip.bottom="`${ txInfo.blkHeight }`" class="d-md-flex justify-content-center align-items-center" >
                        <router-link :to="`/explorer/block/${txInfo.blkHeight}`">
                            {{ $store.state.blockchain.end.minus( txInfo.blkHeight ) }}
                        </router-link>
                    </span>
                </template>
            </div>

            <span class="col-4 d-block d-md-none text-dark text-truncate">Fees</span>
            <div class="col-8 col-md-1 text-truncate">
                <amount :value="tx.fee" :sign="true" :show-asset="false" value-class="d-md-flex justify-content-center align-items-center"/>
            </div>

            <span class="col-4 d-block d-md-none text-dark text-truncate">Type</span>
            <div class="col-8 col-md-1 text-truncate">
                <template v-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE )">
                    <span :class="`badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, tx.base.txScript)} d-md-flex justify-content-center align-items-center`" v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, tx.base.txScript)">{{$store.getters.getTxScriptTextShort(tx.version, tx.base.txScript)}}</span>
                </template>
                <template v-else-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER )">
                    <span v-for="(payload, index) in tx.base.payloads"
                          :key="`tx_type_${index}`">
                        <span :class="`badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, payload.payloadScript)} d-md-flex justify-content-center align-items-center`" v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, payload.payloadScript)">{{$store.getters.getTxScriptTextShort(tx.version, payload.payloadScript)}}</span>
                    </span>
                </template>
            </div>

            <span class="col-4 d-block d-md-none text-dark text-truncate">Data</span>
            <span class="col-8 col-md-2">
                <show-transaction-preview-data :tx="tx" />
            </span>

            <span class="col-4 d-block d-md-none text-dark text-truncate">Message (Memo)</span>
            <div class="col-8 col-md-2 text-truncate">
                <template v-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE )">
                    <template v-if="tx.base.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_PLAIN_TEXT)">
                        <span class="text-truncate d-md-flex justify-content-center align-items-center" v-tooltip.bottom="`${Buffer.from(tx.base.dataPublic, 'hex').toString()}`">{{Buffer.from(tx.base.dataPublic, "hex").toString()}}</span>
                    </template>
                </template>
                <template v-else-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER )">
                    <div v-for="(payload, index) in tx.base.payloads" :key="`tx_payload_${index}`" class="text-truncate d-md-flex justify-content-center align-items-center">
                        <template v-if="payload.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_PLAIN_TEXT)">
                            <span v-tooltip.bottom="`${Buffer.from(payload.dataPublic, 'hex').toString()}`">{{Buffer.from(payload.dataPublic, "hex").toString()}}</span>
                        </template>
                        <template v-if="payload.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_ENCRYPTED)">
                            <span v-if="!decrypted">?</span>
                            <span v-else v-tooltip.bottom="`${Buffer.from(decrypted.zetherTx.payloads[index].message, 'hex').toString()}`">{{Buffer.from(decrypted.zetherTx.payloads[index].message, "hex").toString()}}</span>
                        </template>
                    </div>
                </template>
            </div>

            <span class="col-4 d-block d-md-none text-dark text-truncate">Amount</span>
            <div class="col-8 col-md-2 text-truncate">
                <template v-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER )">
                    <div class="text-truncate d-md-flex justify-content-center align-items-center">
                        <loading-button v-if="canDecrypt && !decrypted" type="button"  v-tooltip.bottom="`Decrypt the transaction to see the amount, shared text and recipient`" @submit="decryptTx" text="Decrypt" icon="fas fa-unlock" :icon-left="false" class-custom="btn btn-falcon-primary btn-sm" />
                        <div v-else v-for="(payload, index) in tx.base.payloads" :key="`tx_payload_${index}`">
                            <span v-if="!decrypted">?</span>
                            <amount v-else-if="decrypted.zetherTx.payloads[index].whisperSenderValid" :value="decrypted.zetherTx.payloads[index].sentAmount" :sign="false" value-class="text-danger" />
                            <amount v-else-if="decrypted.zetherTx.payloads[index].whisperRecipientValid" :value="decrypted.zetherTx.payloads[index].receivedAmount" :sign="true" value-class="text-success" :show-plus-sign="true" />
                            <span v-else>0</span>
                        </div>
                    </div>
                </template>
            </div>

            <span class="col-4 d-block d-md-none text-dark text-truncate">Recipient</span>
            <div class="col-8 col-md-1 text-truncate">
                <template v-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER )">
                    <div v-for="(payload, index) in tx.base.payloads" :key="`tx_payload_${index}`" class="text-truncate d-md-flex justify-content-center align-items-center">
                        <span v-if="!decrypted || !decrypted.zetherTx.payloads[index].recipientPublicKey">?</span>
                        <account-identicon v-else :publicKey="decrypted.zetherTx.payloads[index].recipientPublicKey" size="21" outer-size="4" />
                    </div>
                </template>
            </div>

        </template>

    </div>
</template>

<script>
import StringHelper from "src/utils/string-helper";
import LoadingSpinner from "src/components/utils/loading-spinner";
import ShowTransactionPreviewData from "./show-transaction-preview-data"
import Amount from "src/components/wallet/amount"
import LoadingButton from "src/components/utils/loading-button";
import AccountIdenticon from "../../wallet/account/account-identicon";
export default {

    components: { LoadingSpinner, ShowTransactionPreviewData, Amount, LoadingButton, AccountIdenticon},

    props: {
        txHash: {default: null},
        publicKey: {default: ""},
    },

    data(){
        return {
            decrypted: null,
        }
    },

    computed:{
        PandoraPay: () => PandoraPay,
        Buffer: () => Buffer,

        tx(){
            return this.$store.state.transactionsPreview.txsByHash[this.txHash]
        },
        txInfo(){
            return this.$store.state.transactionsInfo.txsByHash[this.txHash]
        },
        canDecrypt(){
            if (!this.tx || !this.publicKey) return false
            return this.$store.getters.walletContains( this.publicKey)
        },
    },

    methods:{
        timeAgo : (timestamp) => StringHelper.timeSince( timestamp*1000, false ),
        formatTime : (timestamp) => StringHelper.formatTime( timestamp*1000 ),

        async decryptTx(resolve){
            const decrypted = await this.$store.dispatch('decryptTx', {hash: this.txHash, publicKey: this.publicKey})
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
        txHash:{
            immediate: true,
            handler: function (to, from) {
                if (to === from) return

                this.loadTxDecrypted(to, this.publicKey)

                return this.$store.dispatch('getTransactionPreviewByHash', to)
            }
        },
        publicKey: {
            immediate: true,
            handler: function (to, from) {
                if (to === from) return
                this.loadTxDecrypted(this.txHash, to)
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
