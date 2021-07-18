<template>

    <modal ref="modal" title="Wallet Password is Required" >

        <template slot="body">

            <span class="fw-black">For this operation, you need to specify the wallet password.</span>

            <div class="pt-4">
                <label>Password</label>
                <password-input v-model="password"/>
            </div>

            <alert-box class="mt-4" v-if="error" type="error">{{error}}</alert-box>

        </template>

        <template slot="footer">
            <button class="btn btn-falcon-danger" type="button" @click="handleSubmit">
                <i class="fa fa-key"></i> Submit
            </button>
            <button class="btn btn-falcon-secondary" type="button" @click="closeModal">
                <i class="fa fa-ban"></i> Close
            </button>
        </template>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import LoadingSpinner from "../../utils/loading-spinner";
import PasswordInput from "src/components/utils/password-input";
import AlertBox from "src/components/utils/alert-box"

export default {

    components: {LoadingSpinner, Modal, PasswordInput, AlertBox},

    data(){
        return {
            password: "",
            accepted: false,
            error: "",
        }
    },

    computed:{

    },

    methods: {

        async handleSubmit(){
            try{
                this.error = ""

                const out = await PandoraPay.wallet.manager.encryption.checkPasswordWallet(this.password)

                this.accepted = true
                this.closeModal();
            }catch(err){
                this.error = err.toString()
            }
        },

        async showModal() {

            if (!this.$store.state.wallet.isEncrypted) return ''

            Object.assign(this.$data, this.$options.data());
            await this.$refs.modal.showModal();
            return this.accepted ? this.password : null
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

    }

}
</script>

<style scoped>
</style>
