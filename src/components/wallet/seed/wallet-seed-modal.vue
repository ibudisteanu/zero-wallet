<template>

    <modal ref="modal" title="Wallet Seed" >

        <template slot="body">
            <secret-text v-if="seed" :text="seed" title="Seed"  />
        </template>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import PasswordInput from "../../utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import SecretText from "src/components/utils/secret-text"
import AlertBox from "src/components/utils/alert-box"

export default {

    components: {PasswordInput, Modal, SecretText, AlertBox},

    data(){
        return {
            seed: '',
            error: '',
        }
    },

    computed:{


    },

    methods: {

        async showModal() {

            Object.assign(this.$data, this.$options.data());

            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            this.seed = await PandoraPay.wallet.getWalletMnemonic( password )

            return this.$refs.modal.showModal();
        },

        closeModal() {
            return this.$refs.modal.closeModal();
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

    .seed{
        display: inline-block;
    }

</style>
