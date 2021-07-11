<template>

    <modal ref="modal" :title="`QR Code ${title ? ': '+title : ''}`" >
        <div class="qr-code d-inline-block" >
            <qr-code :data="address" />
        </div>
    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import QRCode from "src/components/utils/qr-code"

export default {

    components: { Modal, 'qrCode': QRCode, },

    data(){
        return {
            error:'',
            address: '',
            title: '',
        }
    },

    computed:{

    },

    methods: {

        showModal(address, title) {

            Object.assign(this.$data, this.$options.data());

            this.address = address;
            this.title = title;

            this.$refs.modal.showModal();

        },

        closeModal() {
            this.$refs.modal.closeModal();
        },


    }

}
</script>

<style scoped>

</style>
