<template>

    <modal ref="modal" :title="`${ address ? address.name : '' }`" >

        <span class="thick pd-bottom-40">Private Key</span>

        <span class="font-medium-size wordwrap pd-bottom-40" >{{privateKey}}</span>

        <div class="centered">
            <span class="danger">Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.</span>
        </div>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"

export default {

    components: {Modal},

    data(){
        return {
            address: null,
            privateKey: '',
        }
    },

    methods: {

        showModal(address, privateKey) {
            this.address = address;
            this.privateKey = privateKey;
            this.$refs.modal.showModal();
        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

    }

}
</script>

<style scoped>
    span{
        display: inline-block
    }
    .wordwrap{
        display: block;
    }
</style>