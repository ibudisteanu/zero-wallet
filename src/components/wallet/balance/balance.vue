<template>

    <div class="row pd-top-20">
        <span class="balance thick">
            {{formatMoney( convertToBase( balance ) ) }}
        </span>
        <span class="currency" v-if="getToken">
            <router-link :to="`/tokens/${getToken.hash}`">
                ${{getToken.ticker}}
            </router-link>
        </span>
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
            return this.$store.getters.getTokenInfo(this.token );
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
        font-size: 20px;
        display: inline-block;
    }

    .currency{
        display: inline-block;
    }


</style>
