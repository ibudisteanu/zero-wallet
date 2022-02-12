<template>
    <div>
        <template v-if="tx.version.eq(PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE)">

            <div class="input ">
                <account-identicon :publicKey="tx.base.vin" size="21" :outer-size="0" />
                <amount :value="vinSimpleAmount" :sign="false" />
            </div>

        </template>
        <template v-else-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER ) ">
            <div class="pointer d-md-flex justify-content-center align-items-center">
                <span v-for="(payload,index) in tx.base.payloads" :key="`ring_${index}`" >
                    {{new Decimal(2).pow( payload.ring )}}
                </span>
            </div>
        </template>
    </div>
</template>

<script>
import AccountIdenticon from "../../wallet/account/account-identicon";
import Amount from "../../wallet/amount";
import Decimal from "decimal.js"

export default {

    components: { AccountIdenticon, Amount },

    props: {
        tx: {default: null},
    },

    data(){
        return {
            popoverLeft: 0,
            popoverTop: 0,
            popoverInterval: null,
            displayAdvanced: false,
        }
    },

    computed:{

        PandoraPay: () => PandoraPay,
        Decimal: () => Decimal,

        vinSimpleAmount(){

            if (!this.tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ) return
            let out = new Decimal(0)

            if (this.tx.base.txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UNSTAKE) )
                out = out.plus(this.tx.base.extra.amount)

            if (this.tx.base.txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_DELEGATE) )
                out = out.plus(this.tx.base.extra.output.delegatedStakingClaimAmount)

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
    },

    mounted(){

    },

    beforeUnmount() {
    }

}
</script>

<style scoped>
.input, .output{
    display: inline-block;
    padding-right: 1px;
}
</style>