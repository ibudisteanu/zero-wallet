<template>

    <modal ref="modal" title="Wallet Seed" >

        <template v-slot:body>
            <secret-text v-if="seed" :text="seed" title="Seed" :show-badges="true">
                <template v-slot:warning>
                    DO NOT share these secret words with anyone! These secret words can be used to <strong>STEAL ALL YOUR FUNDS FROM THIS WALLET</strong>
                </template>
            </secret-text>
        </template>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import SecretText from "src/components/utils/secret-text"
import AlertBox from "src/components/utils/alert-box"

export default {

    components: { Modal, SecretText, AlertBox},

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

</style>
