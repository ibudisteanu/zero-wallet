<template>

    <modal ref="modal" title="Loading..."  :close-button="false" >

        <template slot="body">

            <span class="fw-black">Please wait... Don't close the page</span>

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
