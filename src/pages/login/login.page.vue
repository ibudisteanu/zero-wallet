<template>
    <layout>

        <div class="container pd-top-40">
            <div class="boxed centered">

                <img :src="logo" class="logo pd-bottom-20"> <br/>

                <h1 class="title mg-bottom-0">World's First Anonymous Cash</h1>
                <h2 class="sub-title disabled mg-top-0 pd-bottom-40">The Anonymous Cash awaits</h2>

                <div class="left">
                    <span class="disabled" >Password</span> <br/>
                    <input type="password" class="label" v-model="password">
                    <span v-if="error" class="danger">
                        {{error}}
                    </span>
                    <input type="submit" value="Login" :disabled="password.length === 0" @click="login">
                </div>

            </div>

        </div>

    </layout>
</template>

<script>
import Layout from "src/components/layout/layout";
import consts from 'consts/consts';
export default {
    components: {Layout},

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

        async login(){

            this.error = '';

            try{

                const out = await global.apacache.wallet.encryption.decryptWallet(this.password);


            }catch(err){
                console.log(err);
                this.error = 'Password is invalid';
            }

        },

    },

};
</script>

<style scoped>

    .container{
    }

    .boxed{
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