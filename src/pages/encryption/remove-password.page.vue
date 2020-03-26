<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Remove Password</h1>

                <span class="disabled" >Password</span> <br/>
                <password-input v-model="password"/>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <loading-button text="Remove password" @submit="handleRemovePassword" icon="fa fa-unlock-alt"  :disabled="password.length === 0" />

                <div class="centered">
                    <span class="danger">Warning: It will remove your password. You can set it again later.</span>
                </div>

            </div>
        </div>
    </layout>

</template>

<script>

import PasswordInput from "src/components/utils/password-input";
import Layout from "src/components/layout/layout"
import LoadingButton from "src/components/utils/loading-button.vue"

export default {

    components: {PasswordInput, Layout, LoadingButton },

    data(){
        return {
            password: '',
            error: '',
        }
    },

    methods: {

        async handleRemovePassword(resolve){

            try{

                this.error = '';

                this.$store.state.page.refLoadingModal.showModal();


                const out = await PandoraPay.wallet.encryption.removeEncryptionWallet( this.password );

                if (out) {
                    this.$notify({
                        type: 'success',
                        title: `Wallet has been decrypted successfully`,
                        text: `Your wallet has been decrypted. No password is required from now. You can encrypt it with a new password.`,
                    });

                    this.$router.push('/');

                }else
                    throw {message: "Result is not true"};

            }catch(err){
                if (err.message === "Old password is not matching")
                    this.error = "Password is invalid";
                else
                    this.error = err;
            }finally{
                this.$store.state.page.refLoadingModal.closeModal();
                resolve(true);
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