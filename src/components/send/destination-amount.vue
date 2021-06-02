<template>
    <div class="amount-row">
        <div>
            <span class="gray">{{text}}</span>
            <input type="number" v-model="amount" min="0" step="0.0001">
        </div>
        <div>
            <span class="gray">Currency</span>
            <select v-model="tokenCurrency">
                <option v-for="(balance, token) in balances"
                        :key="`send-money-${token}`"
                        :value="token">
                    {{getTokenName(token)}}
                </option>
            </select>
        </div>
    </div>
</template>

<script>
export default {

    data(){
        return {
            amount: 0,
            tokenCurrency: '',
        }
    },

    props:{
        text: {default: 'Amount'},
        balances: {default: null }
    },

    methods:{

        getTokenName(token){
            if (!this.$store.state.tokens.list[token]) return '';
            return this.$store.state.tokens.list[token].name;
        },

    },

    watch: {
        'amount' (to, from) {
            return this.$emit('changed', {
                amount: Math.floor( PandoraPay.argv.transactions.coins.convertToUnits( Number.parseFloat(to) ) ),
            });
        },
        'tokenCurrency' (to, from) {
            return this.$emit('changed', {
                tokenCurrency: to,
            });
        },
    },

}
</script>

<style scoped>
    .amount-row{
        display: grid;
        grid-template-columns: 1fr 400px;
        grid-column-gap: 10px;
    }
</style>
