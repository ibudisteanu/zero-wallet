<template>

  <modal ref="modal" :title="title">

    <template v-slot:body>
      <textarea v-if="textarea" class="form-control form-control-sm fs--2" :rows="textarea.rows" v-model="data" :disabled="!textarea.allowEdit"/>
      <input v-if="input" class="form-control" v-model="data" :disabled="!input.allowEdit"/>
      <alert-box v-if="confirmation" :type="confirmation.type">{{data}}</alert-box>
      <secret-text v-if="secret" class="pt-1" :text="secret.value" :title="secret.title">
        <template v-slot:warning>
          {{ secret.security }}
        </template>
      </secret-text>
    </template>

    <template v-slot:footer>

      <button v-if="button" :class="button.class" type="button" @click="handleSave">
        <i :class="button.icon"></i>
        {{button.text}}
      </button>
      <button class="btn btn-outline-primary" type="button" @click="closeModal">
        <i class="fas fa-ban"></i> Close
      </button>
    </template>


  </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import AlertBox from "src/components/utils/alert-box"
import SecretText from "src/components/utils/secret-text"

export default {

  components: {Modal, AlertBox, SecretText},

  data() {
    return {
      title: "Text",
      data: "",
      type: "textarea", //textarea, input
      final: "",
      input: {allowEdit: true},
      textarea: {rows: 20, allowEdit:true},
      confirmation: {type: "info"},
      secret: {title: "Secret", security: "DO NOT share this secret key with anyone! This private key can be used to STEAL YOUR FUNDS FROM THIS ACCOUNT"},
      button: {text: "Save", icon: 'fas fa-disk', class:'btn btn-primary'},
    }
  },

  methods: {

    async showModal( { title = "Text", data = "", confirmation = null, textarea = null, input = null, secret = null, button }) {

      Object.assign(this.$data, this.$options.data.apply(this))

      this.title = title
      this.data = data

      this.confirmation = confirmation
      this.textarea = textarea
      this.input = input
      this.secret = secret
      if (button !== undefined) this.button = button

      await this.$refs.modal.showModal();

      return this.final
    },

    closeModal() {
      return this.$refs.modal.closeModal();
    },

    handleSave(){

      if (this.confirmation) this.final = true
      else this.final = this.data

      this.closeModal()
    },
  }

}

</script>

<style scoped>
</style>
