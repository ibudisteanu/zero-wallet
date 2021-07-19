<template>

    <div class="row">
        <h4 class="fw-medium pt-2">
            {{delegatedStakePending.pendingType ? '' : '-'}} {{ amount }}
            <small class="fs--1 text-700">/
                <router-link v-if="getToken" :to="`/tokens/${getToken.hash}`">
                    $0x00
                </router-link>
                {{delegatedStakePending.activationHeight}}
            </small>
        </span>
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
            return  this.$store.getters.getTokenInfo( PandoraPay.config.coins.NATIVE_TOKEN_FULL_STRING_HEX );
        },
        amount(){
            return StringHelper.formatMoney( PandoraPay.config.coins.convertToBase( this.delegatedStakePending.pendingAmount.toString() ), PandoraPay.config.coins.DECIMAL_SEPARATOR )
        }
    },

}
</script>

<style scoped>



</style>
