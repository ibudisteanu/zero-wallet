<template>
    <modal v-if="address" ref="modal" title="Receive funds" >

        <div class="account">
            <account-identicon  :identicon="address.identicon" :size="60" :outer-size="70"  />
            <div class="pd-top-10">
                <soan class="wordwrap thick">{{address.name}}</soan>
                <span class="wordwrap">{{address.address}}</span>
            </div>
        </div>

        <div class="qr-code">
            <qr-code :data="address.address" />
        </div>

    </modal>
</template>

<script>

import Modal from "src/components/utils/modal"
import AccountIdenticon from "../account/account-identicon";
import QRCode from "src/components/utils/qr-code"

export default {

    components: {AccountIdenticon, Modal, 'qrCode': QRCode},

    methods:{

        showModal(){
            this.$refs.modal.showModal();
        },

        closeModal(){
            this.$refs.modal.closeModal();
        },

    },

    computed:{

        address(){
            return this.$store.state.addresses[this.$store.state.mainAddress] ;
        }

    },

}
</script>

<style scoped>

    .account{
        display: grid;
        grid-template-columns: 80px 1fr;
    }

    .qr-code{
        text-align: center;
    }

</style>