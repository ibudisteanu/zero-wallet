<template>

    <div class="row">
        <h4 class="fw-medium pt-2" v-if="getToken" >
            <template v-if="version === 'zether' && balanceDecoded === null ">
                <i class="fa fa-question " v-tooltip.bottom="`Homomorphic Encrypted Amount: ${homomorphicBalanceText}`" />
                <i class="fa fa-eye fw-light pointer" v-tooltip.bottom="'Decrypt Amount'" v-if="canBeDecoded" @click="decodeBalance"></i>
            </template>
            <template v-else>
                {{ amount }}
            </template>
            <small class="fs--1 text-700">/
                <router-link :to="`/tokens/${getToken.hash}`" class="currency" v-tooltip.bottom="getToken.hash" >
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
        publicKey: {default: null},     //required for version zether
        canBeDecoded: {default: false}  //required for version zether
    },

    data(){
        return {
            balanceDecoded: null,
        }
    },

    asyncComputed:{
        async amount(){
            let amount
            if (this.version === "transparent")
                amount = this.balance
            else {
                if (this.balanceDecoded === null )
                    return
                else
                    amount = this.balanceDecoded
            }
            return StringHelper.formatMoney( await PandoraPay.config.tokens.tokensConvertToBase( amount.toString(), this.getToken.decimalSeparator ), this.getToken.decimalSeparator)
        }
    },

    computed: {
        homomorphicBalanceText(){
            if (this.version === "zether")
                return this.balance.match(/.{1,20}/g).join("\n");
        },
        getToken(){
            return this.$store.getters.getToken(this.token );
        },
    },

    watch: {
        balance:{
            immediate: true,
            handler: function (to, from) {
                if (to === from) return
                this.balanceDecoded = null
            }
        },
    },

    methods: {
        async decodeBalance(){
            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            this.balanceDecoded = await this.$store.state.page.refDecodeHomomorphicBalanceModal.showModal( this.publicKey, this.balance, this.token, password )
        }
    },

}
</script>

<style scoped>

</style>
