<template>

    <layout>

        <exchange-top-bar />

        <div class="container pd-top-40">
            <div class="boxed ">

                <div class="title">
                    <h1>Exchange Buy coins</h1>

                    <router-link to="/exchange/buy/add-offer">
                        <div class="btn right-float">
                            <div class="btn-round" @click="createOffer" v-tooltip.bottom="'Create a new Buy Offer'" >
                                <i class="fa fa-plus"></i>
                            </div>
                        </div>
                    </router-link>

                </div>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <exchange-offers-list :type="0" />

            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import ExchangeTopBar from "./../common/exchange-top-bar"
import ExchangeOffersList from "./../common/exchange-offers-list"

export default {

    components: { Layout, ExchangeTopBar, ExchangeOffersList },

    data(){
        return {
            error: '',
        }
    },

    computed:{



    },

    methods: {

        createOffer(){

        }

    },

}

</script>

<style scoped>

    .title h1,
    .title .btn{
        display: inline-block;
    }

</style>
