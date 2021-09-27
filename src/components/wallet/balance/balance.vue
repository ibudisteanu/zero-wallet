<template>

    <div class="row">
        <h4 class="fw-medium pt-2" v-if="getToken" >
            <template v-if="version === 'zether'">
                <i class="fa fa-question" v-tooltip.bottom="balance" />
                <i class="fa fa-eye" v-tooltip.bottom="'Decrypt balance'" v-if="canBeDecrypted"></i>
            </template>
            <template v-if="version === 'transparent'">
                {{ amount }}
            </template>
            <small class="fs--1 text-700">/
                <router-link :to="`/tokens/${getToken.hash}`" class="currency">
                    $0x00
                </router-link>
            </small>
        </h4>
    </div>

</template>

<script>

import StringHelper from "src/utils/string-helper"
import Amount from "src/components/wallet/amount"
export default {

    components: {Amount},

    props: {
        version: {default: "transparent"},
        token: {default: ''},
        balance: {default: 0},
        canBeDecrypted: {default: false}
    },

    computed: {
        getToken(){
            return this.$store.getters.getToken(this.token );
        },
        amount(){
            let amount
            if (this.version === "transparent") {
                amount = this.balance
            }else {
                return
            }
            return StringHelper.formatMoney( PandoraPay.config.tokens.tokensConvertToBase( amount.toString(), this.getToken.decimalSeparator ), this.getToken.decimalSeparator)
        }
    },

}
</script>

<style scoped>

</style>
