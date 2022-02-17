<template>

    <div>
        <h4 class="fw-medium pt-2 d-inline-block">
            {{delegatedStakePending.pendingType ? '' : '-'}} {{ amount }}
        </h4>
        <small class="fs--1 text-700 d-inline-block">
            <span class="ps-1">/</span>
            <router-link class="px-1" v-if="getAsset" :to="`/explorer/asset/${$store.getters.convertBase64ToHex(getAsset.hash)}`" v-tooltip.bottom="$store.getters.convertBase64ToHex(getAsset.hash)" >
                {{getAsset.name}}
            </router-link>
            <span v-tooltip.bottom="'Activation Block'" >{{delegatedStakePending.activationHeight}}</span>
        </small>
    </div>

</template>

<script>

import StringHelper from "src/utils/string-helper"
import Decimal from 'decimal.js';

export default {

    props: {
        delegatedStakePending: {default: null},
    },

    computed: {
        getAsset(){
            return  this.$store.getters.getAsset( PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64 );
        },
        amount(){
            return StringHelper.formatMoney( new Decimal(this.delegatedStakePending.pendingAmount).div( new Decimal(10).pow(this.getAsset.decimalSeparator) ).toString(), PandoraPay.config.coins.DECIMAL_SEPARATOR )
        }
    },

}
</script>

<style scoped>



</style>
