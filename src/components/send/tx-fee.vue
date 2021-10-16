<template>
    <div>
        <div class="form-check">
            <input class="form-check-input" id="feeAuto" type="radio" value="feeAuto" v-model="feeType" />
            <label class="form-check-label" for="feeAuto">Auto fee</label>
        </div>

        <div class="form-check">
            <input class="form-check-input" id="feeManual" type="radio" value="feeManual" v-model="feeType" />
            <label class="form-check-label" for="feeManual">Manual fee</label>
        </div>
        <tx-amount v-if="feeType === 'feeManual'" text="Fee Amount" :balances="balances" @changed="changedFeeManual" :allow-zero="allowZero" :asset="asset" />
    </div>
</template>

<script>
import TxAmount from "./tx-amount"
export default {

    components:{TxAmount},

    props: {
        balances: {default: null},
        allowZero: {default: false},
        asset: {default: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX },
    },

    data(){
        return {
            feeType: "feeAuto",
            feeAuto: {
                amount: 0,
                validationError: "",
            },
            feeManual: {
                amount: 0,
                validationError: "",
            },
        }
    },

    methods:{
        changedFeeManual(data){
            this.feeManual = { ...this.feeManual,  ...data, }
        },
        changedFeeAuto(data){
            this.feeAuto = { ...this.feeAuto,  ...data, }
        },
    },

    watch:{
        feeType: {
            immediate: true,
            handler: function (to, from) {
                return this.$emit('changed', {feeType: to,})
            }
        },
        feeAuto: {
            immediate: true,
            handler: function (to, from) {
                return this.$emit('changed', {feeAuto: to,})
            }
        },
        feeManual: {
            immediate: true,
            handler: function (to, from) {
                return this.$emit('changed', {feeManual: to,})
            }
        }
    }

}
</script>