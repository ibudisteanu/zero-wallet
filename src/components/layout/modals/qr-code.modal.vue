<template>

  <modal ref="modal" :title="`QR Code ${title ? ': '+title : ''}`">
    <template v-slot:body>
      <div class="w-100 d-inline-block">
        <qr-code :data="address"/>
      </div>
    </template>
  </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import QRCode from "src/components/utils/qr-code"

export default {

  components: {Modal, 'qrCode': QRCode,},

  data() {
    return {
      error: '',
      address: '',
      title: '',
    }
  },

  computed: {},

  methods: {

    showModal(address, title) {

      Object.assign(this.$data, this.$options.data.apply(this))

      this.address = address;
      this.title = title;

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
