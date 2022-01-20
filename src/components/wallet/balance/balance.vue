<template>

    <div class="row">
        <h4 class="fw-medium pt-2" v-if="getAsset" >
            <template v-if="version === 'zether' && balanceDecoded === null ">
                <i class="fas fa-lock" v-tooltip.bottom="`Homomorphic Encrypted Amount: ${homomorphicBalanceText}`" />
                <i class="fas fa-key pointer" v-tooltip.bottom="'Decrypt Amount'" v-if="canBeDecoded" @click="decodeBalance"></i>
            </template>
            <template v-else>
                {{ amount }}
            </template>
            <small class="fs--1 text-700">/
                <router-link :to="`/explorer/asset/${getAsset.hash}`" class="currency" v-tooltip.bottom="getAsset.hash" >
                    {{getAsset.name}}
                </router-link>
            </small>
        </h4>
    </div>

</template>

<script>

import StringHelper from "src/utils/string-helper"
import Decimal from 'decimal.js';

export default {

    components: {},

    props: {
        version: {default: "transparent"},
        asset: {default: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX},
        balance: {default: new Decimal(0) },
        publicKey: {default: null},     //required for version zether
        canBeDecoded: {default: false}  //required for version zether
    },

    data(){
        return {
            balanceDecoded: null,
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
        amount(){
            let amount
            if (this.version === "transparent")
                amount = this.balance
            else {
                if (this.balanceDecoded === null )
                    return
                else
                    amount = this.balanceDecoded
            }
            return StringHelper.formatMoney( new Decimal(amount).div( new Decimal(10).pow(this.getAsset.decimalSeparator) ).toString(), this.getAsset.decimalSeparator)
        }
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
