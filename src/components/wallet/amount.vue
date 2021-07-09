<template>
    <span>
        <template v-if="getToken">
            <span :class="valueClass">
                {{amount}}
            </span>
            <router-link :to="`/tokens/${getToken.hash}`" :class="tokenClass">
                ${{getToken.ticker}}
            </router-link>
        </template>
        <template v-else>
            <loading-spinner />
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
        valueClass: {default: ""},
        tokenClass: {default: ""}
    },

    computed: {
        getToken(){
            return this.$store.getters.getTokenInfo( this.token );
        },
        amount(){
            return StringHelper.formatMoney(this.value.toString(), this.getToken.decimalSeparator )
        }
    },
}
</script>

<style scoped>
</style>
