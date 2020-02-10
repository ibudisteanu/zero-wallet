<template>
    <layout>
        <div class="container pd-top-20">
            <div class="boxed centered">

                    <img :src="require('src/assets/pandora-pay-logo.png').default"  class="logo"> <br/>

                    <h1 class="title ">404 Not found!</h1>

                    <h2 class="sub-title">{{route}}</h2>

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

        route(){
            return this.$router.currentRoute.path;
        }

    },

    methods:{


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