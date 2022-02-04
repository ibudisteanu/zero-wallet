<template>

    <modal ref="modal" title="Scan QR Code" >

        <template v-slot:body>
            <alert-box v-if="error" type="error">{{error}}</alert-box>
            <video ref="refVideoElem"></video>
        </template>

        <template v-slot:footer>
            <button class="btn btn-falcon-secondary" type="button" @click="closeModal">
                <i class="fas fa-ban"></i> Cancel
            </button>
        </template>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import AlertBox from "src/components/utils/alert-box"
import QrScanner from 'qr-scanner';

export default {

    components: { Modal, AlertBox },

    data(){
        return {
            decoded: "",
            error: '',
            qrScanner: null,
        }
    },

    methods:{

        async showModal(){

            Object.assign(this.$data, this.$options.data());

            const promise = this.$refs.modal.showModal();

            if (! (await QrScanner.hasCamera()) ) this.error = "No camera detected"


            if (this.error === ""){
                this.qrScanner = new QrScanner( this.$refs.refVideoElem, result => {
                    if (result){
                        this.decoded = result
                        this.closeModal()
                    }
                });

                this.qrScanner.start();
            }

            await promise

            if (this.qrScanner) this.qrScanner.destroy();


            return this.decoded;
        },

        closeModal(){
            return this.$refs.modal.closeModal();
        },

    },


}
</script>

<style scoped>
video{
    width: 100%;
}
</style>
