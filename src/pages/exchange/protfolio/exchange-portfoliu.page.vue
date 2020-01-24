<template>

    <layout>

        <exchange-top-bar />

        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Portofolio Trades</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import ExchangeTopBar from "./../common/exchange-top-bar"

export default {

    components: { Layout, ExchangeTopBar },

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

</style>
