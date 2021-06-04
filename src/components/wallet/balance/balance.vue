<template>

    <div class="row pd-top-30">

        <div class="col-xs-6 col-sm-8">
            <div class="balance thick" >
                <span>
                    {{formatMoney( convertToBase( balance ) ) }}
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

const {VERSION_TRANSPARENT} = PandoraPay.enums.wallet.address.version;
import StringHelper from "src/utils/string-helper"

export default {

    props: {
        version: {default: VERSION_TRANSPARENT},
        token: {default: ''},
        balance: {default: 0},
    },

    computed: {
        getToken(){
            return this.$store.state.tokens.list[this.token];
        }
    },

    methods: {
        convertToBase: (amount) => PandoraPay.config.coins.convertToBase( amount.toString() ),
        formatMoney: (amount) => StringHelper.formatMoney(amount, PandoraPay.config.coins.DECIMAL_SEPARATOR ),
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
