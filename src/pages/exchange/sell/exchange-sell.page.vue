<template>

    <layout>

        <exchange-top-bar />

        <div class="container pd-top-40">
            <div class="boxed ">

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <exchange-offers-list :type="1" />

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


    },

}

</script>

<style scoped>
    .title h1,
    .title .btn{
        display: inline-block;
    }
</style>
