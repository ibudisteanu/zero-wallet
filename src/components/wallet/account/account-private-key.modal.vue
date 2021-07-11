<template>

    <modal ref="modal" :title="`Private Key ${ address ? 'of '+address.name : '' }`" >

        <secret-text v-if="privateKey" class="pt-3" :text="privateKey" title="Private Key" warning="STEAL YOUR FUNDS FROM THIS ACCOUNT" />

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import SecretText from "src/components/utils/secret-text"

export default {

    components: { Modal, PasswordInput, LoadingButton, SecretText },

    data(){
        return {
            privateKey: '',
        }
    },

    props:{
        address: {default: null},
    },

    computed:{

        encrypted(){
            return this.$store.state.wallet.encrypted;
        }

    },

    methods: {

        showModal(address,) {

            Object.assign(this.$data, this.$options.data());

            this.address = address;

            this.handleShowPrivateKey();

            this.$refs.modal.showModal();

        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        handleShowPrivateKey(){

            const privateKey = this.address.privateKey.key;
            this.privateKey = privateKey.toString("hex");

        },

        copyPrivateKey(){

            this.$copyText(this.privateKey).then( e =>
                this.$notify({
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `Private Key ${this.privateKey} copied to clipboard`,
                }),
                e =>
                this.$notify({
                    type: 'error',
                    title: `Clipboard failed`,
                    text: `Failed to copy to clipboard`,
                })
            )

        }

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
