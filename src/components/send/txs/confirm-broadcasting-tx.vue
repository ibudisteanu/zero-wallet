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
                        <tbody><tr>
                            <th class="text-900">Fee:</th>
                            <td class="fw-semi-bold">$18,230.00 </td>
                        </tr>
                        <tr>
                            <th class="text-900">Fee Asset:</th>
                            <td class="fw-semi-bold">$1458.40</td>
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
export default {

    components: {ShowTransaction},

    props: {
        tx: {default: null},
    }

}
</script>