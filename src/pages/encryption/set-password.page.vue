<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Set Password</h1>
                <span class="pd-bottom-20">Encrypting your wallet. Use a strong password to avoid brute forcing</span>

                <span class="disabled">Password Strength</span>
                <progress-bar :value="strengthPassword*20" :text="strengthPasswordMessage" />

                <span class="disabled pd-top-20" >Password</span>
                <password-input v-model="password"/>

                <span class="disabled" >Retype Password</span>
                <password-input v-model="retypePassword"/>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <loading-button text="Set Password" @submit="handleSetPassword" icon="fa fa-lock"  :disabled="password.length === 0 || retypePassword.length === 0" />

                <span class="thick pd-top-20 pd-bottom-20">Tip: Write down your password. Use national specific characters.</span>

                <div class="centered">
                    <span class="danger">
                        <strong>Warning:</strong> In case you lose your password, you will need your <strong>seed to recover your seed accounts!</strong>. <br/>
                        Imported accounts generated from a different seed can not be recovered by using your seed.
                    </span>
                </div>

            </div>
        </div>
    </layout>

</template>

<script>

import PasswordInput from "src/components/utils/password-input";
import Layout from "src/components/layout/layout"
import LoadingButton from "src/components/utils/loading-button.vue"
import ProgressBar from "src/components/utils/progress-bar"
import strength from 'strength'

export default {

    components: {PasswordInput, Layout, LoadingButton, ProgressBar},

    data(){
        return {
            password: '',
            retypePassword: '',
            error: '',
        }
    },

    computed: {
        strengthPassword(){
            return strength(this.password)
        },
        strengthPasswordMessage(){
            const strength = this.strengthPassword;
            if (strength <= 1) return 'guessable';
            if (strength <= 2) return 'weak';
            if (strength <= 3) return 'breakable';
            if (strength <= 4) return 'okish';
            if (strength <= 5) return 'strong';
            if (strength === 5) return 'great!';
        }
    },

    methods: {

        async handleSetPassword(resolve){

            try{

                this.error = '';

                this.$store.state.page.refLoadingModal.showModal();

                const promise = new Promise((resolve)=>{


                    setTimeout( async ()=>{

                        try{

                            //if (this.password.length < 6) throw {message: "password is too weak"};
                            if (this.password !== this.retypePassword) throw {message: "passwords are not matching"};

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
                this.$store.state.page.refLoadingModal.closeModal();
                resolve(true);
            }

        },

    }

}

</script>

<style scoped>
    .wordwrap{
        display: block;
    }
</style>