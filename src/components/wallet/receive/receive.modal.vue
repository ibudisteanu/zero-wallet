<template>
    <modal v-if="address" ref="modal" title="Receive funds" >

        <account :address="address" />

        <div class="qr-code">
            <qr-code :data="address.address" />
        </div>

    </modal>
</template>

<script>

import Modal from "src/components/utils/modal"
import QRCode from "src/components/utils/qr-code"
import Account from "./../account/account"

export default {

    components: { Account, Modal, 'qrCode': QRCode},

    data(){
        return {

        }
    },

    methods:{

        showModal(){
            Object.assign(this.$data, this.$options.data());
            this.$refs.modal.showModal();
        },

        closeModal(){
            this.$refs.modal.closeModal();
        },

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
        text-align: center;
    }

</style>