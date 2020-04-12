<template>

    <div class="row pd-top-30">

        <div class="col-xs-6 col-sm-8">

            <div class="balance thick" v-if="isAmountAvailable">
                <span>
                    {{formatMoney( convertToBase( balance.amount ) ) }}
                </span>
            </div>
            <div v-else-if="isScanning">
                <span>Scanning... {{scanPercent}}%</span>
                <div class="progress">
                    <div class="bar" :style="`width:${scanPercent}%`">
                    </div>
                </div>
                <span>
                    Scan {{balance.scanIndex / Math.pow(10, getToken.decimalSeparator-1) }}
                </span>
            </div>

        </div>

        <div class="col-xs-6 col-sm-4">

            <span class="currency thick">
                {{getToken.name}}
            </span>
            <router-link :to="`/tokens/token/${token}`">
                <i class="fa fa-info"></i>
            </router-link>

        </div>
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

    computed: {
        WalletAddressTypeEnum: () => WalletAddressTypeEnum,

        scanPercent(){
            return ((this.balance.scanIndex || 0) / Number.MAX_SAFE_INTEGER * 100).toFixed(3);
        },

        isAmountAvailable(){
            return this.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT || ( this.type === WalletAddressTypeEnum.WALLET_ADDRESS_ZETHER && this.balance.scanStatus === 'finished' )
        },

        isScanning(){
            return this.type === WalletAddressTypeEnum.WALLET_ADDRESS_ZETHER && this.balance.scanStatus === 'started';
        },

        getToken(){
            return this.$store.state.tokens.list[this.token];
        }


    },

    methods: {

        convertToBase(number){
            return PandoraPay.argv.transactions.coins.convertToBase(number);
        },

        formatMoney(amount){
            //return kernel.helpers.StringHelper.formatMoney(amount, 2);
            return amount;
        },



    }

}
</script>

<style scoped>

    .balance{
        font-size: 30px;
        display: inline-block;
    }

    .currency{
        font-size: 20px;
    }


</style>