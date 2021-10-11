<template>

    <div class="row">
        <h4 class="fw-medium pt-2" v-if="getAsset" >
            <template v-if="version === 'zether' && balanceDecoded === null ">
                <i class="fa fa-question " v-tooltip.bottom="`Homomorphic Encrypted Amount: ${homomorphicBalanceText}`" />
                <i class="fa fa-eye fw-light pointer" v-tooltip.bottom="'Decrypt Amount'" v-if="canBeDecoded" @click="decodeBalance"></i>
            </template>
            <template v-else>
                {{ amount }}
            </template>
            <small class="fs--1 text-700">/
                <router-link :to="`/assets/${getAsset.hash}`" class="currency" v-tooltip.bottom="getAsset.hash" >
                    {{getAsset.name}}
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
        asset: {default: ''},
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
            return StringHelper.formatMoney( await PandoraPay.config.assets.assetsConvertToBase( amount.toString(), this.getAsset.decimalSeparator ), this.getAsset.decimalSeparator)
        }
    },

    computed: {
        homomorphicBalanceText(){
            if (this.version === "zether")
                return this.balance.match(/.{1,20}/g).join("\n");
        },
        getAsset(){
            return this.$store.getters.getAsset(this.asset );
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

            const {balanceDecoded} = await this.$store.state.page.refDecodeHomomorphicBalanceModal.showModal( this.publicKey, this.balance, this.asset, true, password )
            this.balanceDecoded = balanceDecoded
        }
    },

}
</script>

<style scoped>

</style>
