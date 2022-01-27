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

            <div class="row justify-content-end">
                <div class="col-auto">
                    <table class="table table-sm table-borderless fs--1 text-end">
                        <tbody>
                            <tr v-for="(fee,index) in fees"
                                      :key="`fee_${index}`">
                                <th class="fw-semi-bold">Fee{{ (fees.length > 1) ? index : ''}}:</th>
                                    <td>
                                        <amount :asset="fee.asset" :value="fee.amount" value-class="text-900" :sign="true" />
                                    </td>
                                </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import ShowTransaction from "src/components/explorer/tx/show-transaction";
import Amount from "src/components/wallet/amount"

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
                    out.push({amount: payload.statement.fee, asset: payload.asset, feeRate: payload.feeRate })

                return out
            }

        }
    },


}
</script>