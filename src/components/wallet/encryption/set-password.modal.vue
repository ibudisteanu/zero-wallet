<template>

    <modal ref="modal" title="Set a password" >

        <span class="disabled" >Password</span> <br/>
        <password-input v-model="password"/>

        <span class="disabled" >Retype Password</span> <br/>
        <password-input v-model="retypePassword"/>

        <span v-if="error" class="danger">
            {{error}}
        </span>

        <input type="submit" value="Set Password" :disabled="password.length === 0 || retypePassword.length === 0" @click="setPassword">

        <span class="thick pd-top-20 pd-bottom-20">Tip: Write down your password.</span>

        <div class="centered">
            <span class="danger">Warning: In case you lose your password, you will need your <strong>seed to recover your seed accounts!</strong>. Imported accounts generated from a different seed can not be recovered by using your seed.</span>
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
            retypePassword: '',
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

        async setPassword(){

            this.error = '';

            try{

                if (this.password.length < 6) throw "password is too weak";
                if (this.password !== this.retypePassword) throw "passwords are not matching";

                const out = await global.apacache.wallet.encryption.encryptWallet( undefined, this.password );

                this.closeModal();

            }catch(err){
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