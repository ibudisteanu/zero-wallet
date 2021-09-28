<template>

    <div class="row">
        <h4 class="fw-medium pt-2">
            {{delegatedStakePending.pendingType ? '' : '-'}} {{ amount }}
            <small class="fs--1 text-700">/
                <router-link v-if="getToken" :to="`/tokens/${getToken.hash}`" v-tooltip.bottom="getToken.hash" >
                    $0x00
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
        getToken(){
            return  this.$store.getters.getToken( PandoraPay.config.coins.NATIVE_TOKEN_FULL_STRING_HEX );
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
