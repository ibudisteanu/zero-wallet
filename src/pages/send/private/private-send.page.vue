<template>

    <layout>

        <layout-title icon="fas fa-money-check-alt" title="Private Send Funds">Send Funds Privately to another address</layout-title>

        <zether-tx :public-key="publicKey" @onSetTab="setTab" >

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
