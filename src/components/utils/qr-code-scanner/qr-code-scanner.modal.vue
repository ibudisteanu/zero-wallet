<template>

    <modal ref="modal" title="Scan QR Code" >

        <template v-slot:body>
            <alert-box v-if="error" type="error">{{error}}</alert-box>
            <div class="pt-4 text-center" v-if="!loaded">
                <loading-spinner class="fs-6"/>
            </div>
            <video ref="refVideoElem"></video>
        </template>

        <template v-slot:footer>
            <select class="form-select camera-select" v-model="cameraSelected">
                <option v-for="(camera, id) in cameraList" @change="handleSelectCamera"
                        :key="`camera-${id}`"
                        :value="id">
                    {{camera.label ? camera.label : '#'+id}}
                </option>
            </select>
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
import LoadingSpinner from "../../utils/loading-spinner";

export default {

    components: { Modal, LoadingSpinner, AlertBox },

    data(){
        return {
            decoded: "",
            error: '',
            qrScanner: null,
            cameraSelected: "",
            cameraList: [],
            loaded: false,
        }
    },

    methods:{

        async showModal(){

            Object.assign(this.$data, this.$options.data());

            const promise = this.$refs.modal.showModal();

            if (! (await QrScanner.hasCamera()) ) this.error = "No camera detected"

            this.cameraList = await QrScanner.listCameras(true)
            if (this.cameraList.length){
                this.cameraSelected = 0
            }

            if (this.error === ""){
                this.qrScanner = new QrScanner( this.$refs.refVideoElem, result => {
                    if (result){
                        this.decoded = result
                        this.closeModal()
                    }
                });

                await this.qrScanner.setInversionMode('both');

                if (this.cameraList.length)
                    await this.qrScanner.setCamera(this.cameraList[this.cameraSelected])

                await this.qrScanner.start();
            }

            this.loaded = true

            await promise

            if (this.qrScanner) {
                await this.qrScanner.stop()
                this.qrScanner.destroy();
            }


            return this.decoded;
        },

        async handleSelectCamera(event){
            if (this.qrScanner)
                await this.qrScanner.setCamera(this.cameraList[event.target.value])
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
    max-height: 480px;
}
.camera-select{
    max-width: 200px
}
</style>
