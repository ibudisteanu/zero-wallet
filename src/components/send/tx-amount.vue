<template>
    <div class="row">
        <div class="col-12">
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">{{text}}</label>
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
        token: {default: ""},
        balances: {default: null },
        allowZero: {default: false,},
        allowEmptyToken: {default: false},
        disabled: {default: false},
    },

    computed:{
        tokenInfo(){
            return this.$store.getters.getToken( this.token );
        },
        getSteps(){
            if (!this.tokenInfo) return ""
            return (1 / Math.pow(10, this.tokenInfo.decimalSeparator)).toFixed(this.tokenInfo.decimalSeparator)
        },
    },

    asyncComputed:{
        async validationAmountError(){
            if ( !this.allowZero && Number.parseFloat(this.amount) === 0) return "Amount needs to be greater than 0"
            if (this.amount === Number.NaN || this.amount < 0) return "Amount can not be negative"

            if (!this.allowEmptyToken){
                for (const key in this.balances) {
                    const balance = this.balances[key]
                    if (balance.token === this.token)
                        if (this.amount > await PandoraPay.config.tokens.tokensConvertToBase( balance.amount.toString(), this.tokenInfo.decimalSeparator )){
                            return "Not enough funds"
                        } else {
                            return
                        }
                }

                return "Token not found"
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
                if (!this.tokenInfo){
                    this.amount = 0
                    return 0
                }

                // to = Number.parseFloat(to)
                // const target = to.toFixed(this.tokenInfo.decimalSeparator)
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
