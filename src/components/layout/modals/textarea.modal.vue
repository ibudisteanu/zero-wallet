<template>

    <modal ref="modal" :title="title">

        <template v-slot:body>
            <textarea class="form-control form-control-sm fs--2" :rows="rows">{{data}}</textarea>
        </template>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"

export default {

    components: { Modal},

    data(){
        return{
            title: "Text",
            data: "",
            rows: 20,
        }
    },

    methods: {

        showModal(title, data, rows=20) {

            Object.assign(this.$data, this.$options.data.apply(this))

            this.title = title
            this.data = data
            this.rows = rows
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
