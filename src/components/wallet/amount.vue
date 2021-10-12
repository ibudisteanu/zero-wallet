<template>
    <span>
        <template v-if="getAsset">
            <span :class="valueClass">
                {{sign?'':'-'}} {{amount}}
            </span>
            <router-link :to="`/assets/${getAsset.hash}`" :class="assetClass">
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

export default {

    components: {LoadingSpinner},

    props: {
        asset: {default: ''},
        value: {default: 0},
        sign: {default: false},
        valueClass: {default: ""},
        assetClass: {default: ""}
    },

    computed: {
        getAsset(){
            return this.$store.getters.getAsset( this.asset );
        },
    },

    asyncComputed:{
        async amount(){
            return StringHelper.formatMoney( await PandoraPay.config.assets.assetsConvertToBase( this.value.toString(), this.getAsset.decimalSeparator ), this.getAsset.decimalSeparator )
        }
    }
}
</script>

<style scoped>
</style>
