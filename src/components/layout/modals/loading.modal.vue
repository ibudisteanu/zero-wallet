<template>

    <modal ref="modal" title="Please wait..."  :close-button="false" >

        <template v-slot:body>

            <span class="fw-black">
                Please wait! <strong>Don't close the webpage</strong> as your wallet is being re-saved in your browser. Otherwise your wallet could get corrupted!
            </span>

            <div class="pt-4 text-center">
                <loading-spinner class="fs-6"/>
            </div>

        </template>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import LoadingSpinner from "../../utils/loading-spinner";

export default {

    components: {LoadingSpinner, Modal},

    methods: {

        showModal() {
            Object.assign(this.$data, this.$options.data());
            return this.$refs.modal.showModal();
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

    }

}

</script>

<style scoped>
</style>
