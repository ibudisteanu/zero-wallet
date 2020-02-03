<template>

    <layout>

        <chat-top-bar />

        <div class="container pd-top-40">
            <div class="boxed ">

                <h2>Chat encrypted </h2>
                <span class="disabled">Trader Public Key: {{publicKey}} </span>


            </div>
        </div>

    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import ChatTopBar from "./common/chat-top-bar"

export default {

    components: { Layout, ChatTopBar },

    data(){
        return {
            error: '',
        }
    },

    computed:{

        publicKey(){
            return this.$route.params.publicKey;
        }

    },

    methods: {


    },

}

</script>

<style scoped>


</style>
