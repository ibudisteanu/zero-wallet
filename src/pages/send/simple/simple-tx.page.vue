<template>

    <layout>

        <layout-title :icon="icon" :title="title">{{subtitle}}</layout-title>

        <simple-tx :tabs-offset="tabsOffset" :titles-offset="titlesOffset" :tx-data="txData" :tx-name="txName"
                   :buttons-offset="buttonsOffset" :public-key="publicKey"
                   @onSetTab=" args => $emit('onSetTab', args )">

            <template v-for="(_, index) in new Array(tabsOffset+1)">
                <template :slot="`tab_${index}`">
                    <slot :name="`tab_${index}`"></slot>
                </template>
            </template>

        </simple-tx>

    </layout>

</template>

<script>
import SimpleTx from "src/components/send/txs/simple-tx"
import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"

export default {

    components: {Layout, LayoutTitle, SimpleTx},

    props: {
        title: {default: "Simple Tx"},
        subtitle: {default: "Simple Transaction"},
        icon: {default: "fa-money-check-alt"},

        tabsOffset: {default: 0},
        titlesOffset: {default: () => []}, //{icon, name}
        txData: {default: () => ({}) },
        buttonsOffset: {default: () => ({}) },
        txName: {default: ""},
    },

    computed: {
        publicKey(){
            return this.$store.state.wallet.mainPublicKey
        },
    },

    methods: {

    },

}
</script>

<style scoped>

</style>
