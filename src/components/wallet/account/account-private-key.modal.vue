<template>

    <modal ref="modal" :title="`Private Key ${ address ? 'of '+address.name : '' }`" >

        <template slot="body">
            <secret-text v-if="privateKey" class="pt-3" :text="privateKey" title="Private Key" >
                <template slot="warning">
                    DO NOT share this private key with anyone! This private key can be used to <strong>STEAL YOUR FUNDS FROM THIS ACCOUNT</strong>
                </template>
            </secret-text>
        </template>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import LoadingButton from "src/components/utils/loading-button"
import SecretText from "src/components/utils/secret-text"

export default {

    components: { Modal, LoadingButton, SecretText },

    data(){
        return {
            privateKey: '',
        }
    },

    props:{
        address: {default: null},
    },

    computed:{
    },

    methods: {

        async showModal(address,) {

            Object.assign(this.$data, this.$options.data());

            this.address = address;

            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            this.privateKey = await PandoraPay.wallet.getWalletAddressPrivateKey( this.address.publicKey, password )

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
