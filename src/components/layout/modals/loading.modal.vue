<template>

    <div>
        <modal ref="modal" title="Loading..."  :close-button="false" >

            <span class="thick">Please wait... Don't close the page</span> <br/>

            <div class="centered pd-top-40">
                <loading-spinner />
            </div>

        </modal>
    </div>

</template>

<script>
import Modal from "src/components/utils/modal"
import LoadingSpinner from "../../utils/loading-spinner";

export default {

    components: {LoadingSpinner, Modal},

    computed:{

    },

    methods: {

        showModal() {
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