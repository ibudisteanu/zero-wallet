<template>

    <div>
        <tx-recipient-address :init-recipient="initRecipient" :text="text" :balances="balances" @changed="changedRecipient" ref="txRecipientAddress" />
        <tx-asset :init-asset="initAsset" :assets="availableAssets" @changed="changedAsset" class="pt-2"/>
        <tx-amount v-if="asset" :init-amount="initAmount" :validate-amount="validateAmount" :allow-zero="allowZero"  class="pt-2" :balances="balances" :asset="asset" @changed="changedAmount" />
    </div>

</template>

<script>

import TxAmount from "./tx-amount"
import TxAsset from "./tx-asset"
import TxRecipientAddress from "./tx-recipient-address";

export default {

    components: {TxRecipientAddress, TxAsset, TxAmount},

    props:{
        initRecipient: {default: ""},
        initAmount: {default: new Decimal(0)},
        initAsset: {default: null},
        availableAssets: {default: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64},
        balances: {default: null },
        text: {default: "Recipient"},
        allowZero: {default: false},
        validateAmount: {default: false},
    },

    data(){
        return {
            asset: null,
        }
    },

    methods: {

        setRecipientData( recipient, amount, asset ){
            if (recipient) this.$refs.txRecipientAddress.setRecipient( recipient )
        },

        changedRecipient(data){
            return this.$emit('changed', { ...data, });
        },

        changedAmount(data){
            return this.$emit('changed', { ...data, });
        },

        changedAsset(data){
            if (data.asset) this.asset = data.asset
            return this.$emit('changed', { ...data, });
        },

    },



}
</script>

