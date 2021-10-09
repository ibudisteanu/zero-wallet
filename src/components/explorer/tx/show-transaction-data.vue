<template>
    <div>
        <template v-if="tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE">

            <div class="input">
                <account-identicon :publicKey="tx.vin.publicKey" size="21" outer-size="7" />
                <amount :value="vinAmount" :sign="false" />
            </div>

            <template v-if="tx.txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_CLAIM">
                <div class="output" v-for="(out, index) in tx.output"
                     :key="`show-transaction-vout-${index}`">
                    <account-identicon :publicKey="out.publicKey" size="21" outer-size="7" />
                    <amount :value="out.amount" :sign="true" />
                </div>
            </template>

        </template>
        <template v-else-if="tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER">

            <div v-for="(payload, payloadId) in tx.payloads"
                 :key="`show-tx-payload-${payloadId}`">
                <div v-if="!id || payloadId === id" class="output" v-for="(publicKey, index) in payload.statement.publickeylist"
                     :key="`show-transaction-vout-${index}`">
                    <account-identicon :publicKey="publicKey" size="21" outer-size="7" />
                    ?
                </div>
            </div>

        </template>
    </div>
</template>

<script>
import AccountIdenticon from "../../wallet/account/account-identicon";
import Amount from "../../wallet/amount";

export default {

    components: {AccountIdenticon, Amount},

    props: {
        tx: {default: null},
        id: {default: "" },
    },

    computed:{
        PandoraPay(){
            return PandoraPay
        },

        vinAmount(){

            if (this.tx.version !== PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) return
            let out = this.tx.fee

            if (this.tx.txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_CLAIM)
                for (const it of this.tx.output){
                    out += it.amount
                }

            return out
        }

    }

}
</script>

<style scoped>
    .input, .output{
        display: inline-block;
        padding-right: 5px;
    }
</style>