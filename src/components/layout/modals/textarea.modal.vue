<template>

  <modal ref="modal" :title="title">

    <template v-slot:body>
      <textarea class="form-control form-control-sm fs--2" :rows="rows" v-model="data" :disabled="!allowEdit"/>
    </template>

    <template v-slot:footer>

      <button v-if="allowEdit" class="btn btn-primary" type="button" @click="handleSave">
        <i class="fas fa-disk"></i> Save
      </button>
      <button class="btn btn-outline-primary" type="button" @click="closeModal">
        <i class="fas fa-ban"></i> Close
      </button>
    </template>


  </modal>

</template>

<script>
import Modal from "src/components/utils/modal"

export default {

  components: {Modal},

  data() {
    return {
      title: "Text",
      data: "",
      final: "",
      allowEdit: false,
      rows: 20,
    }
  },

  methods: {

    async showModal(title, data, rows = 20, allowEdit = false) {

      Object.assign(this.$data, this.$options.data.apply(this))

      this.title = title
      this.data = data
      this.final = data
      this.rows = rows
      this.allowEdit = allowEdit

      await this.$refs.modal.showModal();

      return this.final
    },

    closeModal() {
      return this.$refs.modal.closeModal();
    },

    handleSave(){
      this.final = this.data
      this.closeModal()
    },
  }

}

</script>

<style scoped>
</style>
