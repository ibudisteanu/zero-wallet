<template>

    <layout>

        <chat-top-bar />

        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Encrypted Chat</h1>

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



    },

    methods: {


    },

}

</script>

<style scoped>


</style>
