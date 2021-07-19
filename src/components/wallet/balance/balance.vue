<template>

    <div class="row">
        <h4 class="fw-medium pt-2" v-if="getToken" >
            {{ amount }}
            <small class="fs--1 text-700">/
                <router-link :to="`/tokens/${getToken.hash}`" class="currency">
                    $0x00
                </router-link>
            </small>
        </h4>
    </div>

</template>

<script>

const {VERSION_TRANSPARENT} = PandoraPay.enums.wallet.address.version;
import StringHelper from "src/utils/string-helper"
import amount from "src/components/wallet/amount"
export default {

    components: {amount},

    props: {
        version: {default: VERSION_TRANSPARENT},
        token: {default: ''},
        balance: {default: 0},
    },

    computed: {
        getToken(){
            return this.$store.getters.getTokenInfo(this.token );
        },
        amount(){
            return StringHelper.formatMoney( PandoraPay.config.tokens.tokensConvertToBase(this.balance.toString(), this.getToken.decimalSeparator.toString() ), this.getToken.decimalSeparator)
        }
    },

}
</script>

<style scoped>

</style>
