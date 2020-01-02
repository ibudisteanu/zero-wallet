<template>

    <div>
        <modal ref="modal" title="Loading..." v-if="isLoading" :open-always="true" :close-button="false" >

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

        isLoading(){
            return this.$store.state.wallet.isLoading;
        }

    },

    methods: {

        showModal() {
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