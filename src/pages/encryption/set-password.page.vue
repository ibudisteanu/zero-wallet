<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Set Password</h1>

                <span class="disabled" >Password</span> <br/>
                <password-input v-model="password"/>

                <span class="disabled" >Retype Password</span> <br/>
                <password-input v-model="retypePassword"/>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <loading-button text="Set Password" @submit="handleSetPassword" icon="fa fa-lock"  :disabled="password.length === 0 || retypePassword.length === 0" />

                <span class="thick pd-top-20 pd-bottom-20">Tip: Write down your password.</span>

                <div class="centered">
                    <span class="danger">Warning: In case you lose your password, you will need your <strong>seed to recover your seed accounts!</strong>. Imported accounts generated from a different seed can not be recovered by using your seed.</span>
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

    components: {PasswordInput, Layout, LoadingButton},

    data(){
        return {
            password: '',
            retypePassword: '',
            error: '',
        }
    },

    methods: {

        async handleSetPassword(resolve){

            try{

                this.$store.commit('setIsLoading', true);

                const promise = new Promise((resolve)=>{


                    setTimeout( async ()=>{

                        this.error = '';

                        try{

                            //if (this.password.length < 6) throw "password is too weak";
                            if (this.password !== this.retypePassword) throw "passwords are not matching";

                            const out = await PandoraPay.wallet.encryption.encryptWallet( undefined, this.password );

                            if (out) {

                                this.$notify({
                                    type: 'success',
                                    title: `Wallet has been encrypted successfully`,
                                    text: `Your wallet has been encrypted with the password provided`,
                                });

                                this.$router.push('/');

                            }
                            else
                                throw {message: "Result is not true"};


                        }catch(err){
                            this.error = err;
                        }

                        resolve(true);

                    }, 1000);

                });

                await promise;



            }finally{
                this.$store.commit('setIsLoading', false);
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