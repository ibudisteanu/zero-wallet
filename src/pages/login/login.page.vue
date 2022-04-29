<template>

    <layout :disable-layout="true">

        <div class="col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">

            <div class="d-flex flex-center mb-3">
                <img :src="require(`src/assets/logo-square${$store.state.settings.dark?'':''}.png`).default" class="logo" :alt="name">
            </div>
            <h1 class="d-flex flex-center mb-3 logo-color">
                Pandora Pay
            </h1>

            <div class="d-flex flex-center mb-2 mb-sm-4">
                <h2 class="fs-0 fs-sm-2 fs-md-3">The Anonymous Cash awaits</h2>
            </div>

            <div>
                <label>Password</label>
                <password-input v-model="password" v-on:keyup.native.enter="()=>$refs.refLoadingButton.handleClick()" />

                <alert-box class="mt-3" v-if="error" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''" >{{error}}</alert-box>

                <div class="pt-3 d-flex justify-content-center">
                    <loading-button ref="refLoadingButton" text="Login" @submit="handleLogin" icon="fas fa-sign-in-alt"  :disabled="!password.length" />
                </div>

            </div>

        </div>

    </layout>
</template>

<script>
import Layout from "src/components/layout/layout";
import consts from 'consts/consts';
import PasswordInput from "src/components/utils/password-input";
import LoadingSpinner from "src/components/utils/loading-spinner";
import LoadingButton from "src/components/utils/loading-button"
import AlertBox from "src/components/utils/alert-box"
import UtilsHelper from "src/utils/utils-helper"
export default {
    components: {LoadingSpinner, PasswordInput, Layout, LoadingButton, AlertBox},

    data(){
        return {
            password: '',
            error: '',
        }
    },

    computed:{
        name(){
            return consts.name;
        }
    },

    methods:{

        async handleLogin(resolve){

            this.error = '';

            try{

                await UtilsHelper.sleep(50)

                const out = await PandoraPay.wallet.manager.encryption.decryptWallet(this.password);

                if (!out)
                    throw "An error was encountered";

                this.$store.dispatch('readWallet' )

                if (this.$router.currentRoute.path !== '/')
                    this.$router.push('/');

            }catch(err){

                if (err.message === "Invalid password")
                    this.error = 'Password is invalid';
                else
                    this.error = err.message;

            }finally{
                resolve(true);
            }

        },

    },

};
</script>

<style scoped>

    .logo{
        max-width: 100px;
        max-height: 100px;
    }

    .dark .logo{
        -webkit-filter: drop-shadow( 0px 0px 25px rgba(255, 255, 255, 0.5));
        filter: drop-shadow( 0px 0px 25px rgba(255, 255, 255, 0.5));
    }

</style>
