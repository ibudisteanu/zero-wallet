<template>

    <div>
        <span class="balance thick" >
            {{formatMoney( convertToBase( balance.amount ) ) }}
        </span>
        <span class="currency thick">
            {{getToken(token).name}}
        </span>
        <router-link :to="`/tokens/token/${token}`">
            <i class="fa fa-info"></i>
        </router-link>
        <br/>
    </div>


</template>

<script>

const {WalletAddressTypeEnum} = global.blockchain.blockchain.wallet;

export default {

    props: {
        type: {default: WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT},
        token: {default: '00'},
        balance: {default: null},
    },

    methods: {

        convertToBase(number){
            return PandoraPay.argv.transactions.coins.convertToBase(number);
        },

        formatMoney(amount){
            //return kernel.helpers.StringHelper.formatMoney(amount, 2);
            return amount;
        },

        getToken(token){
            return this.$store.state.tokens.list[token];
        }


    }

}
</script>

<style scoped>

    .balance{
        font-size: 30px;
    }

    .currency{
        font-size: 20px;
    }


</style>