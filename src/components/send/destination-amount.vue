<template>
    <div class="row">
        <div class="col-12 col-sm-7">
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">{{text}}</label>
            <input :class="`form-control ${validationAmountError ? 'is-invalid' :''}`" type="number" v-model.number="amount" min="0" :step="getSteps">
            <div v-if="validationAmountError" class="invalid-feedback d-block">{{validationAmountError}}</div>
        </div>
        <div class="col-12 col-sm-5">
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
        balances: {default: null }
    },

    computed:{
        selectedTokenInfo(){
            return this.$store.getters.getTokenInfo( this.selectedToken );
        },
        getSteps(){
            if (!this.selectedTokenInfo) return ""
            return (1 / Math.pow(10, this.selectedTokenInfo.decimalSeparator)).toFixed(this.selectedTokenInfo.decimalSeparator)
        },
        validationAmountError(){
            if ( Number.parseFloat(this.amount) === 0) return "Amount needs to be greater than 0"
        },
        validationTokenError(){
            if ( !this.selectedTokenInfo) return "Token was not selected"
        }
    },

    methods:{

        getTokenInfo(token){
            return this.$store.getters.getTokenInfo( token );
        },

        getTokenName(token){
            const tokenInfo = this.getTokenInfo( token )
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
            return this.$emit('changed', {
                token: to,
            });
        },

    },

}
</script>

<style scoped>
</style>
