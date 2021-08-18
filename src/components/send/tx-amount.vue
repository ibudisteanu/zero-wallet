<template>
    <div class="row">
        <div :class="`col-12 ${allowToken ? 'col-sm-7' : ''}`" v-if="allowAmount">
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">{{text}}</label>
            <input :class="`form-control ${validationAmountError ? 'is-invalid' :''}`" type="number" v-model.number="amount" min="0" :step="getSteps">
            <div v-if="validationAmountError" class="invalid-feedback d-block">{{validationAmountError}}</div>
        </div>
        <div :class="`col-12 ${allowAmount ? 'col-sm-5' : ''}`" v-if="allowToken">
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Token</label>
            <select :class="`form-select ${validationTokenError ? 'is-invalid' :''}`" v-model="selectedToken">
                <option v-for="(balance, id) in balances"
                        :key="`send-money-${id}`"
                        :value="balance.token">
                    {{getTokenName(balance.token)}}
                </option>
            </select>
            <div v-if="validationTokenError" class="invalid-feedback d-block">{{validationTokenError}}</div>
        </div>
    </div>
</template>

<script>
export default {

    data(){
        return {
            amount: 0,
            selectedToken: '',
        }
    },

    props:{
        text: {default: 'Amount'},
        balances: {default: null },
        allowZero: {default: false,},
        allowAmount: {default: true},
        allowToken: {default: true},
    },

    computed:{
        selectedTokenInfo(){
            return this.$store.getters.getToken( this.selectedToken );
        },
        getSteps(){
            if (!this.selectedTokenInfo) return ""
            return (1 / Math.pow(10, this.selectedTokenInfo.decimalSeparator)).toFixed(this.selectedTokenInfo.decimalSeparator)
        },
        validationAmountError(){
            if ( !this.allowZero && Number.parseFloat(this.amount) === 0) return "Amount needs to be greater than 0"
            if (this.amount === Number.NaN || this.amount < 0) return "Amount can not be negative"

            for (const key in this.balances) {
                const balance = this.balances[key]
                if (balance.token === this.selectedToken)
                    if (this.amount > PandoraPay.config.tokens.tokensConvertToBase( balance.amount.toString(), this.selectedTokenInfo.decimalSeparator ))
                        return "Not enough funds"
            }
        },
        validationTokenError(){
            if ( !this.selectedTokenInfo) return "Token was not selected"
        },
        validationError(){
            if (this.validationTokenError) return this.validationTokenError
            if (this.validationAmountError) return this.validationAmountError
        }
    },

    methods:{

        getToken(token){
            return this.$store.getters.getToken( token );
        },

        getTokenName(token){
            const tokenInfo = this.getToken( token )
            if (tokenInfo)
                return tokenInfo.name;
        },


    },

    watch: {
        amount (to, from) {

            if (!this.selectedTokenInfo){
                this.amount = 0
                return 0
            }

            // to = Number.parseFloat(to)
            // const target = to.toFixed(this.selectedTokenInfo.decimalSeparator)
            // if (to.toString() !== target ){
            //     this.amount = target
            //     return
            // }

            return this.$emit('changed', {
                amount: to,
            });
        },
        selectedToken (to, from) {
            return this.$emit('changed', { token: to, });
        },
        validationError(to, from){
            return this.$emit('changed', { validationError: to, });
        },

    },

}
</script>

<style scoped>
</style>
