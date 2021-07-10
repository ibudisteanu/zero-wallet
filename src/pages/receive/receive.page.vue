<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Receive Money {{ title }}</h1>

                <account :address="address" />

            </div>
        </div>
    </layout>

</template>

<script>

import Account from "src/components/wallet/account/account"
import Layout from "src/components/layout/layout"
const {version} = PandoraPay.enums.wallet.address;

export default {

    components: { Account, Layout},

    data(){
        return {

        }
    },

    methods:{

    },

    computed:{

        title(){
          if (this.address === version.VERSION_TRANSPARENT) return 'Transparent';
        },

        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKeyHash] ;
        }

    },

}
</script>

<style scoped>


    .qr-code{
    }

</style>
