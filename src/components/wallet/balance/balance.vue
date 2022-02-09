<template>

    <div class="row">
        <h4 class="fw-medium pt-2" v-if="getAsset" >
            <template v-if="version === 'zether' && balanceDecrypted === null ">
                <i class="fas fa-lock pe-2" v-tooltip.bottom="`Homomorphic Encrypted Amount: ${homomorphicBalanceText}`" />
                <i class="fas fa-key pe-2 pointer" v-tooltip.bottom="'Decrypt Amount'" v-if="canBeDecrypted" @click="decryptBalance"></i>
            </template>
            <template v-else>
                {{ amount }}
            </template>
            <small class="ps-1 fs--1 text-700">/
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
        balance: {default: () => new Decimal(0) },
        publicKey: {default: null},     //required for version zether
        canBeDecrypted: {default: false}  //required for version zether
    },

    data(){
        return {
            balanceDecrypted: null,
        }
    },

    computed: {
        homomorphicBalanceText(){
            if (this.version === "zether")
                return this.balance;
        },
        getAsset(){
            return this.$store.getters.getAsset(this.asset );
        },
        amount(){
            let amount
            if (this.version === "transparent")
                amount = this.balance
            else {
                if (this.balanceDecrypted === null )
                    return
                else
                    amount = this.balanceDecrypted
            }
            return StringHelper.formatMoney( new Decimal(amount).div( new Decimal(10).pow(this.getAsset.decimalSeparator) ).toString(), this.getAsset.decimalSeparator)
        }
    },

    watch: {
        balance:{
            immediate: true,
            handler: function (to, from) {
                if (to === from) return
                this.balanceDecrypted = null
            }
        },
    },

    methods: {
        async decryptBalance(){
            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            const {balanceDecrpted} = await this.$store.state.page.refDecryptBalanceModal.showModal( this.publicKey, this.balance, this.asset, true, password )
            this.balanceDecrpted = balanceDecrpted
        }
    },

}
</script>

<style scoped>

</style>
