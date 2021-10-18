<template>
    <div>
        <template v-if="tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE">

            <div class="input">
                <account-identicon :publicKey="tx.base.vin" size="21" outer-size="7" />
                <amount :value="vinSimpleAmount" :sign="false" />
            </div>

            <template v-if="tx.base.txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_CLAIM">
                <template v-if="!displayAdvanced">
                    <span class="pointer" @click="displayAdvanced=!displayAdvanced" v-tooltip.bottom="'Display tx output'"  >
                        <i class="fa fa-users" ></i>
                        Outputs: {{tx.base.extra.output.length}}
                    </span>
                </template>
                <template v-else>
                    <div class="output" v-for="(out, index) in tx.base.extra.output"
                         :key="`show-transaction-vout-${index}`">
                        <account-identicon :publicKey="out.publicKey" size="21" outer-size="7" />
                        <amount :value="out.amount" :sign="true" />
                    </div>
                </template>
            </template>

        </template>
        <template v-else-if="tx.version === PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER">
            <template v-if="!displayAdvanced">
                <span class="pointer" @click="displayAdvanced=!displayAdvanced" v-tooltip.bottom="'Display Private Tx Ring Members'" >
                    <i class="fa fa-users"></i>
                    Rings: {{tx.base.payloads.map(payload => payload.publicKeys.length).join(', ') }}
                </span>
            </template>
            <template v-else>
                <div v-for="(payload, payloadIndex) in tx.base.payloads"
                     :key="`${tx.hash}_payload_${payloadIndex}`">
                    <div class="output" v-for="(publicKey, index) in payload.publicKeys"
                         :key="`show-transaction-vout-${index}`">
                        <account-identicon :publicKey="publicKey" size="21" outer-size="7" />
                        ?
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>

<script>
import AccountIdenticon from "../../wallet/account/account-identicon";
import Amount from "../../wallet/amount";

export default {

    components: {AccountIdenticon, Amount },

    props: {
        tx: {default: null},
    },

    data(){
        return {
            displayAdvanced: false,
        }
    },

    computed:{
        PandoraPay(){
            return PandoraPay
        },

        vinSimpleAmount(){

            if (this.tx.version !== PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) return
            let out = this.tx.base.fees

            if (this.tx.base.txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_CLAIM)
                for (const it of this.tx.base.extra.output)
                    out += it.amount

            return out
        }
    },

    watch: {
        tx:{
            immediate: true,
            handler: function (to, from) {
                if (to === from) return
                this.displayAdvanced = false
            }
        },
    },

    methods: {
        showPopover(){

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