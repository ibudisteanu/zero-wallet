<template>
    <span>
        <template v-if="getAsset">
            <span :class="valueClass">
                {{sign?'':'-'}} {{amount}}
            </span>
            <router-link :to="`/explorer/asset/${getAsset.hash}`" :class="assetClass" v-if="showAsset">
                {{getAsset.name}}
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
import Decimal from 'decimal.js';

export default {

    components: {LoadingSpinner},

    props: {
        asset: {default: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX},
        value: {default: 0},
        sign: {default: false},
        showAsset: {default: true},
        valueClass: {default: ""},
        assetClass: {default: ""}
    },

    computed: {
        getAsset(){
            return this.$store.getters.getAsset( this.asset );
        },
        amount(){
            return StringHelper.formatMoney( new Decimal(this.value).div( new Decimal(10).pow(this.getAsset.decimalSeparator) ).toString(), this.getAsset.decimalSeparator )
        }
    },

}
</script>

<style scoped>
</style>
