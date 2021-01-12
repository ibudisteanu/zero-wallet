<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Receive Money {{ title }}</h1>

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
const {WalletAddressTypeEnum} = global.blockchain.blockchain.wallet;

export default {

    components: { Account, 'qrCode': QRCode, Layout},

    data(){
        return {

        }
    },

    methods:{

    },

    computed:{

        title(){
          if (this.address === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT) return 'Transparent';
        },

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