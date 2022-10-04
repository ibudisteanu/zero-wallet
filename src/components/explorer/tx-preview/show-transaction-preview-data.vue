<template>
    <div>
        <template v-if="tx.version.eq(PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE)">

            <div class="pointer d-md-flex justify-content-center align-items-center">
                <template v-if="tx.base.txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_ASSET_FEE_LIQUIDITY)">
                    <account-identicon :publicKey="tx.base.vin" size="21" :outer-size="0" />
                </template>
            </div>

        </template>
        <template v-else-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER ) ">
            <div class="">
                <div v-for="(payload,index) in tx.base.payloads" :key="`ring_${index}`" class="col-12 d-md-flex justify-content-center align-items-center">
                    <i class="fas fa-users px-1"></i>
                    <span class="pe-1">{{new Decimal(2).pow( payload.ring )}}</span>
                    <template v-if="payload.payloadScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_STAKING_REWARD) && payload.extra">
                        <account-identicon :publicKey="payload.extra.delegatePublicKey" size="21" :outer-size="0" />
                        <amount :value="payload.extra.delegatedStakingClaimAmount" :sign="true" />
                    </template>
                    <template v-if="payload.payloadScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_STAKING) && payload.extra">
                        <amount :value="payload.burnValue" :sign="true" />
                    </template>
                </div>
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