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
                <span v-if="getToken">
                    Scan {{balance.scanIndex / Math.pow(10, getToken.decimalSeparator) }}
                </span>
            </div>

        </div>

        <div class="col-xs-6 col-sm-4">

            <span v-if="getToken" class="currency thick">
                {{getToken.name}}
            </span>
            <router-link :to="`/tokens/token/${token}`">
                <i class="fa fa-info"></i>
            </router-link>

        </div>
    </div>


</template>

<script>

const {version} = PandoraPay.enums.wallet.address;

export default {

    props: {
        type: {default: version.VERSION_TRANSPARENT},
        token: {default: ''},
        balance: {default: null},
    },

    computed: {

        version: () => version,

        scanPercent(){
            return ((this.balance.scanIndex || 0) / Number.MAX_SAFE_INTEGER * 100).toFixed(3);
        },

        isAmountAvailable(){
            return this.type === version.VERSION_TRANSPARENT
        },

        isScanning(){
            return false;
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
            //return PandoraLibrary.helpers.StringHelper.formatMoney(amount, 2);
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
