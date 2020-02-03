<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Remove Password</h1>

                <span class="disabled" >Password</span> <br/>
                <password-input v-model="password"/>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <input type="submit" value="Remove password" :disabled="password.length === 0 " @click="removePassword">

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

export default {

    components: {PasswordInput, Layout },

    data(){
        return {
            password: '',
            error: '',
        }
    },

    methods: {

        async removePassword(){

            this.$store.commit('setIsLoading', true);

            try{

                this.error = '';

                try{

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
                }

            }catch(err){

            }
            this.$store.commit('setIsLoading', false);


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