<template>
    <span>
        <template v-if="getToken">
            <span :class="valueClass">
                {{sign?'':'-'}} {{amount}}
            </span>
            <router-link :to="`/tokens/${getToken.hash}`" :class="tokenClass">
                $0x00
            </router-link>
        </template>
        <template v-else>
            <loading-spinner />`
        </template>
    </span>
</template>

<script>
import StringHelper from "src/utils/string-helper";
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

    components: {LoadingSpinner},

    props: {
        token: {default: ''},
        value: {default: 0},
        sign: {default: false},
        valueClass: {default: ""},
        tokenClass: {default: ""}
    },

    computed: {
        getToken(){
            return this.$store.getters.getToken( this.token );
        },
        amount(){
            return StringHelper.formatMoney( PandoraPay.config.tokens.tokensConvertToBase( this.value.toString(), this.getToken.decimalSeparator.toString() ), this.getToken.decimalSeparator )
        }
    },
}
</script>

<style scoped>
</style>
