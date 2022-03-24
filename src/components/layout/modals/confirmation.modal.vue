<template>

  <modal ref="modal" :title="title">

    <template v-slot:body>
      <alert-box :type="type">
        {{text}}
      </alert-box>
    </template>

    <template v-slot:footer>

      <button class="btn btn-falcon-danger" type="button" @click="handleConfirm">
        <i class="fas fa-times"></i> Yes, I confirm
      </button>
      <button class="btn btn-outline-primary" type="button" @click="closeModal">
        <i class="fas fa-ban"></i> Close
      </button>
    </template>

  </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import AlertBox from "../../utils/alert-box";

export default {

  components: { Modal, AlertBox },

  data(){
    return{
      title: "Text",
      text: "",
      type: "info",
      confirmation: false,
    }
  },

  methods: {

    async showModal( title, text, type = "info" ) {

      Object.assign(this.$data, this.$options.data.apply(this))

      this.title = title
      this.text = text
      this.type = type
      this.confirmation = false

      await this.$refs.modal.showModal();

      return this.confirmation
    },

    closeModal() {
      return this.$refs.modal.closeModal();
    },

    handleConfirm(){
      this.confirmation = true;
      return this.closeModal()
    },

  }

}

</script>

<style scoped>
</style>
