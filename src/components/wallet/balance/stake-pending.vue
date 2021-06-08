<template>

    <div class="row pd-top-20">
        <span class="balance thick"> {{stakePending.pendingType ? '+' : '-'}} {{formatMoney( convertToBase( stakePending.pendingAmount ) ) }} </span>
        <span class="currency" v-if="getToken">
            <router-link :to="`/tokens/${getToken.hash}`">
                ${{getToken.ticker}}
            </router-link>
            {{stakePending.activationHeight}}
        </span>
    </div>

</template>

<script>

import StringHelper from "src/utils/string-helper"

export default {

    props: {
        stakePending: {default: null},
    },

    computed: {
        getToken(){
            return this.$store.getters.getTokenInfo( PandoraPay.config.coins.NATIVE_TOKEN_FULL_STRING_HEX );
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
        padding-right: 10px;
        display: inline-block;
    }
    .currency{
        display: inline-block;
    }

</style>
