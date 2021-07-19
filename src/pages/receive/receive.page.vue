<template>

    <layout>

        <layout-title icon="fa-file-invoice-dollar" title="Receive funds publicly">Generate your address to receive funds publicly.</layout-title>

        <account :address="address" title="Receive Funds" />

    </layout>

</template>

<script>

import Account from "src/components/wallet/account/account"
import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
const {version} = PandoraPay.enums.wallet.address;

export default {

    components: { Account, Layout, LayoutTitle},

    data(){
        return {

        }
    },

    methods:{

    },

    computed:{
        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKeyHash] ;
        }
    },

}
</script>

<style scoped>
</style>
