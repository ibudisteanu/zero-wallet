<template>

    <div class="row">
        <h4 class="fw-medium pt-2">
            {{delegatedStakePending.pendingType ? '' : '-'}} {{ amount }}
            <small class="fs--1 text-700">/
                <router-link v-if="getAsset" :to="`/assets/${getAsset.hash}`" v-tooltip.bottom="getAsset.hash" >
                    {{getAsset.name}}
                </router-link>
                <span v-tooltip.bottom="'Activation Block'" >{{delegatedStakePending.activationHeight}}</span>
            </small>
        </h4>
    </div>

</template>

<script>

import StringHelper from "src/utils/string-helper"

export default {

    props: {
        delegatedStakePending: {default: null},
    },

    computed: {
        getAsset(){
            return  this.$store.getters.getAsset( PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX );
        },
    },

    asyncComputed:{
        async amount(){
            return StringHelper.formatMoney( await PandoraPay.config.coins.convertToBase( this.delegatedStakePending.pendingAmount.toString() ), PandoraPay.config.coins.DECIMAL_SEPARATOR )
        }
    }

}
</script>

<style scoped>



</style>
