<template>

    <div class="row">
        <h4 class="fw-medium pt-2">
            {{delegatedStakePending.pendingType ? '' : '-'}} {{ amount }}
            <small class="fs--1 text-700">/
                <router-link v-if="getAsset" :to="`/explorer/asset/${getAsset.hash}`" v-tooltip.bottom="getAsset.hash" >
                    {{getAsset.name}}
                </router-link>
                <span v-tooltip.bottom="'Activation Block'" >{{delegatedStakePending.activationHeight}}</span>
            </small>
        </h4>
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
            return  this.$store.getters.getAsset( PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX );
        },
        amount(){
            return StringHelper.formatMoney( new Decimal(this.delegatedStakePending.pendingAmount).div( new Decimal(10).pow(this.getAsset.decimalSeparator) ).toString(), PandoraPay.config.coins.DECIMAL_SEPARATOR )
        }
    },

}
</script>

<style scoped>



</style>
