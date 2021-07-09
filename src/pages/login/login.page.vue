<template>

    <layout>
        <div class="container pd-top-20">
            <div class="centered">

                <loading-spinner v-if="!$store.state.wallet.loaded" />

                <div v-if="$store.state.wallet.loaded">

                    <img :src="require('src/assets/pandora-pay-logo.png').default"  class="logo"> <br/>

                    <h1 class="title mg-bottom-0 mg-top-0">World's First Anonymous Cash</h1>
                    <h2 class="sub-title gray mg-top-0 pd-bottom-40">The Anonymous Cash awaits</h2>

                    <div class="left">
                        <span class="gray" >Password</span>
                        <password-input v-model="password"/>

                        <div v-if="error" class="alert alert-danger border-2 d-flex align-items-center">
                            <div class="bg-white me-3 icon-item"><i class="fa fa-times"></i> </div>
                            <p class="mb-0 flex-1">{{error}}</p>
                        </div>

                        <loading-button text="Login" @submit="handleLogin" icon="fa fa-sign-in-alt"  :disabled="password.length === 0" />
                    </div>

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
import LoadingButton from "src/components/utils/loading-button.vue"

export default {
    components: {LoadingSpinner, PasswordInput, Layout, LoadingButton},

    data(){
        return {
            password: '',
            error: '',
        }
    },

    computed:{
        logo(){
            return consts.logo;
        }
    },

    methods:{

        async handleLogin(resolve){

            this.error = '';

            try{

                const out = await PandoraPay.wallet.encryption.decryptWallet(this.password);

                if (!out)
                    throw Error("An error was encountered");

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

    .container{
        max-width: 400px;
    }

    .logo{
        max-width: 200px;
        max-height: 200px;
    }

    .title{
        font-weight: bolder;
    }

    .sub-title{
        font-weight: normal;
    }

</style>
