<template>
    <div class="row">
        <div class="col-12">
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">{{text}}</label>
            <i v-if="tooltip" class="fa fa-question" v-tooltip.bottom="tooltip" />
            <input :class="`form-control ${validationAmountError ? 'is-invalid' :''}`" type="number" v-model.number="amount" min="0" :step="getSteps" :disabled="disabled">
            <div v-if="validationAmountError" class="invalid-feedback d-block">{{validationAmountError}}</div>
        </div>
    </div>
</template>

<script>
export default {

    data(){
        return {
            amount: 0,
        }
    },

    props:{
        text: {default: 'Amount'},
        tooltip: {default: ''},
        asset: {default: ""},
        accounts: {default: null },
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
            return (1 / Math.pow(10, this.assetInfo.decimalSeparator)).toFixed(this.assetInfo.decimalSeparator)
        },
    },

    asyncComputed:{
        async validationAmountError(){
            if ( !this.allowZero && Number.parseFloat(this.amount) === 0) return "Amount needs to be greater than 0"
            if (this.amount === Number.NaN || this.amount < 0) return "Amount can not be negative"
            if (this.validateAmount){
                for (const value of this.accounts)
                    if ( value.asset === this.asset && this.amount * Math.pow(10, this.assetInfo.decimalSeparator) >  value.amount)
                         return "Amount is higher than available funds"
            }
        },
        async validationError(){
            if (await this.validationAmountError) return await this.validationAmountError
        }
    },

    methods:{
    },

    watch: {

        amount: {
            immediate: true,
            handler: function (to, from) {
                if (!this.assetInfo){
                    this.amount = 0
                    return 0
                }

                // to = Number.parseFloat(to)
                // const target = to.toFixed(this.assetInfo.decimalSeparator)
                // if (to.toString() !== target ){
                //     this.amount = target
                //     return
                // }

                return this.$emit('changed', {
                    amount: to,
                });
            }
        },

        validationError: {
            immediate: true,
            handler: function (to, from) {
                return this.$emit('changed', {validationError: to,})
            }
        },

    },

}
</script>

<style scoped>
</style>
