<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Receive Money {{address.type === 0 ? 'Transparently' : 'Anonymously' }}</h1>

                <account :address="address" />

                <div class="qr-code pd-top-20">
                    <qr-code :data="address.address" />
                </div>

            </div>
        </div>
    </layout>

</template>

<script>

import QRCode from "src/components/utils/qr-code"
import Account from "src/components/wallet/account/account"
import Layout from "src/components/layout/layout"

export default {

    components: { Account, 'qrCode': QRCode, Layout},

    data(){
        return {

        }
    },

    methods:{

    },

    computed:{

        address(){
            return this.$store.state.addresses.list[this.$store.state.wallet.mainAddress] ;
        }

    },

}
</script>

<style scoped>


    .qr-code{
    }

</style>