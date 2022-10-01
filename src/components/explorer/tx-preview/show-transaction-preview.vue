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
                <router-link :to="`/explorer/tx/${$base64ToHex(tx.hash)}`">
                    {{$base64ToHex(tx.hash)}}
                </router-link>
           </span>

            <span class="col-4 d-block d-md-none text-dark text-truncate">Time</span>
            <div class="col-8 col-md-1 text-truncate">
                <template v-if="txInfo">
                    <span v-if="txInfo.mempool" class="d-md-flex justify-content-center align-items-center">
                        <i class="fas fa-clock" v-tooltip.bottom="`Pending...`" />
                    </span>
                    <span v-else-if="txInfo.timestamp" v-tooltip.bottom="`${ $formatTime( $store.state.blockchain.genesisTimestamp.plus(  txInfo.timestamp ).times(1000) ) }`" class="d-md-flex justify-content-center align-items-center"  >
                        {{ $timeSince( $store.state.blockchain.genesisTimestamp.plus( txInfo.timestamp ).times(1000), false ) }}
                    </span>
                </template>
            </div>

            <span class="col-4 d-block d-md-none text-dark text-truncate">Confirmations</span>
            <div class="col-8 col-md-1 text-truncate">
                <template v-if="txInfo">
                    <span v-if="txInfo.mempool" class="d-md-flex justify-content-center align-items-center">
                        <i class="fas fa-clock" v-tooltip.bottom="`Pending...`" />
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
            <div class="col-8 col-md-1">
                <template v-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE )">
                    <span :class="`text-truncate badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, tx.base.txScript)} d-md-flex justify-content-center align-items-center`" v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, tx.base.txScript)">{{$store.getters.getTxScriptTextShort(tx.version, tx.base.txScript)}}</span>
                </template>
                <template v-else-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER )">
                    <span v-for="(payload, index) in tx.base.payloads" :key="`tx_type_${index}`" class="col-12">
                        <span :class="`text-truncate badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, payload.payloadScript)} d-md-flex justify-content-center align-items-center`" v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, payload.payloadScript)">{{$store.getters.getTxScriptTextShort(tx.version, payload.payloadScript)}}</span>
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
                    <div class="col-12  text-truncate d-md-flex justify-content-center align-items-center">
                        <template v-if="tx.base.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_PLAIN_TEXT)">
                            <span v-tooltip.bottom="`${Buffer.from(tx.base.dataPublic, 'base64').toString()}`">{{Buffer.from(tx.base.dataPublic, "base64").toString()}}</span>
                        </template>
                    </div>
                </template>
                <template v-else-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER )">
                    <div v-for="(payload, index) in tx.base.payloads" :key="`tx_payload_${index}`" class="col-12  text-truncate d-md-flex justify-content-center align-items-center">
                        <template v-if="payload.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_PLAIN_TEXT)">
                            <span v-tooltip.bottom="`${Buffer.from(payload.dataPublic, 'base64').toString()}`">{{Buffer.from(payload.dataPublic, "base64").toString()}}</span>
                        </template>
                        <template v-if="payload.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_ENCRYPTED)">
                            <span v-if="!decrypted || !decrypted.zetherTx.payloads[index]" v-tooltip.bottom="`Encrypted Memo`">?</span>
                            <span v-else v-tooltip.bottom="`String: ${$store.getters.printEncryptedTxMemo(decrypted.zetherTx.payloads[index].message)} || Base64: ${decrypted.zetherTx.payloads[index].message}`">{{$store.getters.printEncryptedTxMemo(decrypted.zetherTx.payloads[index].message)}}</span>
                        </template>
                    </div>
                </template>
            </div>

            <span class="col-4 d-block d-md-none text-dark text-truncate">Amount</span>
            <div class="col-8 col-md-2 text-truncate">
                <div v-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER )">
                    <loading-button v-if="canDecrypt && !decrypted" type="button" tooltip="Decrypt the transaction to see the amount, shared text and recipient" @submit="decryptTx" text="Decrypt" icon="fas fa-unlock" :icon-left="false" class-custom="badge rounded-pill bg-info" component="span" />
                    <div v-else v-for="(payload, index) in tx.base.payloads" :key="`tx_payload_${index}`" class="col-12 text-truncate d-md-flex justify-content-center align-items-center">
                        <span v-if="!decrypted || !decrypted.zetherTx.payloads[index]" v-tooltip.bottom="`Confidential amount`">?</span>
                        <amount v-else-if="decrypted.zetherTx.payloads[index].whisperSenderValid" :value="decrypted.zetherTx.payloads[index].sentAmount" :sign="false" value-class="text-danger" />
                        <amount v-else-if="decrypted.zetherTx.payloads[index].whisperRecipientValid" :value="decrypted.zetherTx.payloads[index].receivedAmount" :sign="true" value-class="text-success" :show-plus-sign="true" />
                        <amount v-else v-tooltip.bottom="`You received zero`" :value="new Decimal(0)" :sign="true"/>
                    </div>
                </div>
            </div>

            <span class="col-4 d-block d-md-none text-dark text-truncate">Recipient</span>
            <div class="col-8 col-md-1 text-truncate">
                <template v-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER )">
                    <div v-for="(payload, index) in tx.base.payloads" :key="`tx_payload_${index}`" class="col-12 text-truncate d-md-flex justify-content-center align-items-center">
                        <span v-if="!decrypted || !decrypted.zetherTx.payloads[index] || !decrypted.zetherTx.payloads[index].recipientPublicKey" v-tooltip.bottom="`Unknown Recipient`">?</span>
                        <account-identicon v-else :publicKey="decrypted.zetherTx.payloads[index].recipientPublicKey" size="21" :outer-size="0" />
                    </div>
                </template>
            </div>

        </template>

    </div>
</template>

<script>
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
