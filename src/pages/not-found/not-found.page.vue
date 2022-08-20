<template>
    <layout :disable-layout="true">
        <div class="row flex-center min-vh-100 py-6 text-center">
            <div class="col-sm-10 col-md-8 col-lg-6 col-xxl-5">
                <router-link to="/" class="d-flex flex-center mb-4" >
                  <img class="me-2" :src="require(`src/assets/logo-inline${$store.state.settings.dark?'':''}.png`).default" :alt="name" height="100">
                </router-link>
                <div class="card">
                    <div class="card-body p-4 p-sm-5">

                        <div class="fw-black lh-1 text-300 fs-error">404</div>

                        <p class="lead mt-4 text-800 font-sans-serif fw-semi-bold w-md-75 w-xl-100 mx-auto">The page you're looking for is not found.</p>
                        <hr>
                        <p>Make sure the address is correct and that the page hasn't moved.
                            If you think this is a mistake, contact the devs.
                        </p>

                        <router-link class="btn btn-falcon-primary btn-sm mt-3" to="/">
                            <i class="fas fa-home"></i>
                            Take me home
                        </router-link>
                    </div>
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

        name(){
          return consts.name
        },

        route(){
            return this.$router.currentRoute.path || '';
        }

    },

    methods:{


    },

};
</script>

<style scoped>

</style>
