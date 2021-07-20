<template>

    <layout>

        <layout-title icon="fa-lock" title="Encrypt wallet" >Set a password for your wallet. The password will be necessary on your machine to open and use the wallet.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Set the password of your wallet</h5>
                    </div>
                </div>
            </div>
            <div class="card-body">

                <div class="row">
                    <div class="col-12 col-sm-6">
                        <label>Password</label>
                        <password-input v-model="password"/>
                    </div>
                    <div class="col-12 col-sm-6">
                        <label >Retype Password</label>
                        <password-input v-model="retypePassword"/>
                    </div>
                </div>

                <div class="row pt-4">
                    <div class="col-12 col-sm-6">
                        <label>Encryption difficulty: {{encryptionDifficulty}} <i class="fa fa-question" v-tooltip.bottom="'The harder the encryption is, the harder for brute force is to crack it'" /> </label>
                        <input class="form-range" type="range" min="1" max="10" v-model="encryptionDifficulty" />
                        <label v-if="encryptionDifficulty > 1">WARNING: High Difficulty will require 40-60 seconds to verify the password</label>
                    </div>
                    <div class="col-12 col-sm-6">
                        <label>Password Strength <i class="fa fa-question" v-tooltip.bottom="'Avoid using guessable passwords as dictionary attacks can crack it.'" /> </label>
                        <progress-bar :value="strengthPassword*20" :text="strengthPasswordMessage" />
                    </div>
                </div>

            </div>
            <div class="card-body bg-light">
                <alert-box v-if="error" type="error">{{error}}</alert-box>
                <div class="text-center">
                    <loading-button text="Set Password" @submit="handleSetPassword" icon="fa fa-lock"  :disabled="password.length === 0 || retypePassword.length === 0" />
                </div>
            </div>
        </div>

        <alert-box type="info">
            <strong>Warning:</strong> <br/> <br/>
            In case you lose your password, you will need your <strong>seed to recover your seed accounts!</strong> <br/><br/>
            Imported accounts generated from a different seed can not be recovered by using your seed.
            Use a strong password to avoid brute forcing.
        </alert-box>

    </layout>

</template>

<script>

import PasswordInput from "src/components/utils/password-input";
import Layout from "src/components/layout/layout"
import LoadingButton from "src/components/utils/loading-button.vue"
import ProgressBar from "src/components/utils/progress-bar"
import strength from 'strength'
import AlertBox from "src/components/utils/alert-box"
import LayoutTitle from "src/components/layout/layout-title";
import UtilsHelper from "src/utils/utils-helper"

export default {

    components: {PasswordInput, Layout, LayoutTitle, LoadingButton, ProgressBar, AlertBox},

    data(){
        return {
            password: '',
            retypePassword: '',
            encryptionDifficulty: 1,
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

                await UtilsHelper.sleep(50 )

                //if (this.password.length < 6) throw Error("password is too weak");
                if (this.password !== this.retypePassword) throw Error("passwords are not matching");

                const out = await PandoraPay.wallet.manager.encryption.encryptWallet( this.password, this.encryptionDifficulty );

                if (!out) throw "Result is not true";

                this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Wallet has been encrypted successfully`,
                    text: `Your wallet has been encrypted with the password provided`,
                });

                this.$router.push('/');

            }catch(err){
                this.error = err.toString();
            }finally{
                this.$store.state.page.refLoadingModal.closeModal();
                resolve(true);
            }

        },

    }

}

</script>

<style scoped>

</style>
