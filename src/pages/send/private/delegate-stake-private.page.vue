<template>

    <layout>

        <layout-title icon="fa-money-check-alt" title="Private Delegate Funds">Delegate Funds Privately to Delegating Address</layout-title>

        <zether-tx :tabs-offset="1" :titles-offset="[ {icon: 'fas fa-edit', name: 'Amount', tooltip: 'Unstaking amount' }]"
                   tx-name="createZetherDelegateStakingTx" :public-key="publicKey" @onSetTab="setTab" >

            <template slot="tab_0">

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
    }

}

</script>

<style scoped>
</style>
