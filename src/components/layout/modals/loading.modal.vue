<template>

    <modal ref="modal" title="Loading..."  :close-button="false" >

        <span class="thick">Please wait... Don't close the page</span>

        <div class="centered pt-5">
            <loading-spinner />
        </div>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import LoadingSpinner from "../../utils/loading-spinner";

export default {

    components: {LoadingSpinner, Modal},

    data(){
        return {

        }
    },

    computed:{

    },

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
