<template>

    <modal ref="modal" title="Set a password" >

        <span class="disabled" >Password</span> <br/>
        <password-input v-model="password"/>

        <span v-if="error" class="danger">
            {{error}}
        </span>

        <input type="submit" value="Remove password" :disabled="password.length === 0 " @click="removePassword">

        <div class="centered">
            <span class="danger">Warning: It will remove your password. You can set it again later.</span>
        </div>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import PasswordInput from "../../utils/password-input";

export default {

    components: {PasswordInput, Modal},

    data(){
        return {
            password: '',
            error: '',
        }
    },

    methods: {

        showModal() {
            this.$refs.modal.showModal();
        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        async removePassword(){

            this.error = '';

            try{

                const out = await global.apacache.wallet.encryption.removeEncryptionWallet( this.password );

                if (out)
                    this.$notify({
                        type: 'success',
                        title: `Wallet has been decrypted successfully`,
                        text: `Your wallet has been decrypted. No password is required from now. You can encrypt it with a new password.`,
                    });


                this.closeModal();

            }catch(err){

                if (err.message === "Old password is not matching")
                    this.error = "Password is invalid";
                else
                    this.error = err;
            }


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