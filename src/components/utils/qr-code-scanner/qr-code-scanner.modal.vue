<template>

    <modal ref="modal" title="Scan QR Code" >

        <template slot="body">
            <alert-box v-if="error" type="error">{{error}}</alert-box>
            <template v-else>
                <qrcode-stream class="qrcodeStream" @decode="onDecode" @init="onInit" />
            </template>
        </template>

        <template slot="footer">
            <button class="btn btn-falcon-secondary" type="button" @click="closeModal">
                <i class="fas fa-ban"></i> Cancel
            </button>
        </template>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import Vue from 'vue'
import AlertBox from "src/components/utils/alert-box"

let VueQrcodeReader = undefined;
if (typeof window !== "undefined") {
    VueQrcodeReader = require("vue-qrcode-reader/src/index");
    Vue.use(VueQrcodeReader);
    VueQrcodeReader = VueQrcodeReader.QrcodeStream;
}

export default {

    components: { Modal, VueQrcodeReader, AlertBox },

    data(){
        return {
            decoded: "",
            error: '',
        }
    },

    methods:{

        async showModal(){

            Object.assign(this.$data, this.$options.data());
            await this.$refs.modal.showModal();

            return this.decoded;
        },

        closeModal(){
            return this.$refs.modal.closeModal();
        },

        onDecode (decodedString) {
            if (decodedString !== ""){
                this.decoded = decodedString
                this.closeModal()
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
