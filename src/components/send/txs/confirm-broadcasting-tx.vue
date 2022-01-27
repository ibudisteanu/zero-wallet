<template>
    <div>
        <div class="">

            <div class="row align-items-center text-center mb-3">
                <div class="col-sm-6 text-sm-start">
                    <img :src="require('src/assets/svgs/sending-coins.svg').default" alt="review tx" width="150">
                </div>
                <div class="col text-sm-end mt-3 mt-sm-0">
                    <h2 class="mb-3">Transaction Preview</h2>
                    <h5>Transaction Details</h5>
                    <p class="fs--1 mb-0">Review the transaction details before propagating it to the network</p>
                </div>
                <div class="col-12">
                    <hr>
                </div>
            </div>


            <div class="mt-2">
                <show-transaction :tx="tx" :show-tx-info="false"/>
            </div>

            <div v-for="(fee,index) in fees"
                 :key="`fee_${index}`">

                <div class="row pt-2 pb-2">
                    <span class="col-5 col-sm-3 fw-medium text-truncate">Fee{{ (fees.length > 1) ? index : ''}}</span>
                    <span class="col-7 col-sm-9 text-truncate">
                        <amount :asset="fee.asset" :value="fee.amount" value-class="text-900" :sign="true" />
                    </span>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
import ShowTransaction from "src/components/explorer/tx/show-transaction";
import Amount from "src/components/wallet/amount"
import Decimal from "decimal.js";

export default {

    components: {ShowTransaction, Amount},

    props: {
        tx: {default: null},
    },

    computed:{
        fees(){
            if (!this.tx) return []

            if (this.tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ){
                return [ {amount: this.tx.fee, asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX, feeRate: 1 } ]
            }else if (this.tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER) ) {

                const out = []
                for (const payload of this.tx.payloads)
                    out.push({amount: payload.statement.fee.mul(payload.feeRate).div( new Decimal(10).pow( payload.feeLeadingZeros ) ), asset: payload.asset, feeRate: payload.feeRate })

                return out
            }

        }
    },


}
</script>