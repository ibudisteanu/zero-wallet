<template>

    <layout>

        <layout-title :icon="icon" :title="title">{{subtitle}}</layout-title>

        <zether-tx :tabs-offset="tabsOffset" :titles-offset="titlesOffset" :tx-data="txData" :tx-name="txName"
                   :buttons-offset="buttonsOffset" :public-key="publicKey"
                   @onSetTab=" args => $emit('onSetTab', args )">>

            <template v-for="(_, index) in new Array(tabsOffset+1)">
                <template :slot="`tab_${index}`">
                    <slot :name="`tab_${index}`"></slot>
                </template>
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
        title: {default: "Private Send Funds"},
        subtitle: {default: "Send Funds Privately to another address"},
        icon: {default: "fa-money-check-alt"},

        tabsOffset: {default: 0},
        titlesOffset: {default: () => []}, //{icon, name}
        txData: {default: () => ({}) },
        buttonsOffset: {default: () => ({}) },
        txName: {default: "createZetherTx"},
    },

    computed: {
        publicKey(){
            return this.$store.state.wallet.mainPublicKey
        },
    },

}

</script>

<style scoped>
</style>
