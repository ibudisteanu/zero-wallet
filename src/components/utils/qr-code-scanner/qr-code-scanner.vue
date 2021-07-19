<template>

    <modal ref="modal" title="Scan QR Code" >

        <qrcode-stream class="qrcodeStream" @decode="onDecode" @init="onInit" />

        <alert-box v-if="error" type="error">{{error}}</alert-box>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import Vue from 'vue'
import AlertBox from "src/components/utils/alert-box"

let VueQrcodeReader = undefined;
if (typeof window !== "undefined") {
    VueQrcodeReader = require("vue-qrcode-reader");
    Vue.use(VueQrcodeReader);
    VueQrcodeReader = VueQrcodeReader.QrcodeStream;
}

export default {

    components: { Modal, VueQrcodeReader, AlertBox },

    data(){
        return {
            error: '',
            onDecoded: undefined,
        }
    },

    methods:{

        showModal(onDecoded){

            this.onDecoded = onDecoded;

            return this.$refs.modal.showModal();
        },

        closeModal(){
            return this.$refs.modal.closeModal();
        },

        onDecode (decodedString) {

            const result = decodedString;
            if (this.onDecoded) {
                this.onDecoded(decodedString);
                this.$refs.refModal.closeModal();
            }
        },

        async onInit (promise) {

            try {
                await promise;
                this.error = '';
            } catch (error) {
                if (error.name === 'NotAllowedError') this.error = "ERROR: you need to grant camera access permission";
                else if (error.name === 'NotFoundError') this.error = "ERROR: no camera on this device";
                else if (error.name === 'NotSupportedError') this.error = "ERROR: secure context required (HTTPS, localhost)";
                else if (error.name === 'NotReadableError') this.error = "ERROR: is the camera already in use?";
                else if (error.name === 'OverconstrainedError') this.error = "ERROR: installed cameras are not suitable";
                else if (error.name === 'StreamApiNotSupportedError') this.error = "ERROR: Stream API is not supported in this browser";
            }

        }

    },


}
</script>

<style scoped>
</style>
