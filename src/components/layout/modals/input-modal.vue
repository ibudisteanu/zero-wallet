<template>

  <modal ref="modal" :title="title">

    <template v-slot:body>
      <textarea v-if="textarea" :class="`form-control ${textarea.class||''}`" :rows="textarea.rows" v-model="data" :disabled="!textarea.allowEdit"/>
      <input v-if="input" :class="`form-control ${input.class||''}`" v-model="data" :disabled="!input.allowEdit"/>
      <alert-box v-if="alert" :type="alert.type" :class="`${alert.class||''}`">{{alert.text}}</alert-box>
      <secret-text v-if="secret" :class="`${secret.class||''}`" :text="secret.value" :title="secret.title">
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
      alert: {type: "info", text: ""},
      secret: {title: "Secret", security: "DO NOT share this secret key with anyone! This private key can be used to STEAL YOUR FUNDS FROM THIS ACCOUNT"},
      button: {text: "Save", icon: 'fas fa-disk', class:'btn btn-primary'},
    }
  },

  methods: {

    async showModal( { title = "Text", data = "", alert = null, textarea = null, input = null, secret = null, button }) {

      Object.assign(this.$data, this.$options.data.apply(this))

      this.title = title
      this.data = data

      this.alert = alert
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

      if (this.textarea || this.input) this.final = this.data
      else this.final = true

      this.closeModal()
    },
  }

}

</script>

<style scoped>
</style>
