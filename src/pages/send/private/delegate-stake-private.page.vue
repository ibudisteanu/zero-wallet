<template>

    <layout>

        <layout-title icon="fa fa-piggy-bank" title="Private Delegate Funds">Delegate Funds Privately to Delegating Address</layout-title>

        <zether-tx ref="refZetherTx"
                   :titles-offset="{ '0.5': {icon: 'fas fa-edit', name: 'Delegation', tooltip: 'Delegation update' }}"
                   :init-available-assets="[PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX]"
                   tx-name="createZetherDelegateStakingTx" :public-key="publicKey" @onSetTab="setTab" >

            <template :slot="`tab_0.5`">
                xxx
            </template>

        </zether-tx>

    </layout>
</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title";
import ZetherTx from "src/components/send/txs/zether-tx";

export default {

    components: { ZetherTx,  LayoutTitle, Layout, },

    props: {
    },

    computed: {
        PandoraPay() {
            return PandoraPay
        },
        publicKey(){
            return this.$store.state.wallet.mainPublicKey
        },
    },

    methods: {
        async setTab({resolve, reject, oldTab, value}){
            try{

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },
    },

    mounted(){
        this.$refs.refZetherTx.asset = {asset: ""}
    },

}

</script>

<style scoped>
</style>
