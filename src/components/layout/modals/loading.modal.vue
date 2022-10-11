<template>

  <modal ref="modal" title="Please wait..." :close-button="false">

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
      this.$refs.modal.showModal();
      return new Promise((resolve, reject) => {
        this.$nextTick(() => resolve())
      })
    },

    closeModal() {
      if (this.$refs.modal) return this.$refs.modal.closeModal();
    },

  }

}

</script>

<style scoped>
</style>
