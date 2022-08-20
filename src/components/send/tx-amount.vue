<template>
    <div class="row">
        <div class="col-12">
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">{{text}} Amount</label>
            <i v-if="tooltip" class="fas fa-question" v-tooltip.bottom="tooltip" />
            <input :class="`form-control ${validationError ? 'is-invalid' :''}`" type="number" v-model.number="amount" min="0" :step="getSteps" :disabled="disabled">
            <div v-if="validationError" class="invalid-feedback d-block">{{validationError}}</div>
        </div>
    </div>
</template>

<script>
import StringHelper from "../../utils/string-helper";
import Decimal from "decimal.js";

export default {

    data(){
        return {
            amountBase: new Decimal(0),
        }
    },

    props:{
        text: {default: ''},
        tooltip: {default: ''},
        asset: {default: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64 },
        balances: {default: () => ({}) },
        allowZero: {default: false,},
        validateAmount: {default: false },
        disabled: {default: false},
    },

    computed:{
        assetInfo(){
            return this.$store.getters.getAsset( this.asset );
        },
        getSteps(){
            if (!this.assetInfo) return ""
            return new Decimal(1).div( new Decimal(10).pow( this.assetInfo.decimalSeparator) ).toString()
        },

        validationError() {
            if (!this.allowZero && Number.parseFloat(this.amount) === 0) return "Amount needs to be greater than 0"
            if (this.amount === Number.NaN || this.amount < 0) return "Amount can not be negative"
            if (this.validateAmount) {

                if (!this.asset)
                    return "Asset is invalid"
                if (!this.balances)
                    return "Balances are invalid"

                if (!this.balances[this.asset])
                    return 'Available funds: none'

                if (this.amountBase > this.balances[this.asset].amount )
                    return `Amount is higher than available funds ${this.$formatMoney( new Decimal(this.balances[this.asset].amount).div( new Decimal(10).pow(this.assetInfo.decimalSeparator) ).toString(), this.assetInfo.decimalSeparator)}`

            }
        },
        amount: {

            get(){
                return this.amountBase.div( new Decimal(10).pow(this.assetInfo.decimalSeparator) ).toString()
            },
            set(to, from ){

                if (!this.assetInfo){
                    this.amountBase = 0
                    return
                }

                this.amountBase = new Decimal(to).mul( new Decimal(10).pow(this.assetInfo.decimalSeparator) ).round()

                return this.$emit('changed', {
                    amount: this.amountBase,
                });
            },

        },
    },

    methods:{
    },

    watch: {

        validationError: {
            immediate: true,
            handler: function (to, from) {
                return this.$emit('changed', {
                    amountValidationError: to,
                })
            }
        },

    },

}
</script>

<style scoped>
</style>
