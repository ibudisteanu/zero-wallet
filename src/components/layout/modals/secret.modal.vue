<template>

  <modal ref="modal" :title="title">
    <template v-slot:body>
      <secret-text v-if="secret" class="pt-1" :text="secret" :title="title">
        <template v-slot:warning>
          {{ security }}
        </template>
      </secret-text>
    </template>
  </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import SecretText from "src/components/utils/secret-text"

export default {

  components: {Modal, SecretText},

  data() {
    return {
      secret: '',
      title: 'Secret',
      security: 'DO NOT share this secret key with anyone! This private key can be used to STEAL YOUR FUNDS FROM THIS ACCOUNT'
    }
  },

  methods: {

    async showModal(secret, title, security) {
      Object.assign(this.$data, this.$options.data.apply(this))
      this.secret = secret;
      if (title) this.title = title
      if (security) this.security = security
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
