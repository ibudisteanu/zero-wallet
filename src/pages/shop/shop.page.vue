<template>

    <layout>

        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Shop</h1>

                <span>It will be available in version 0.2</span>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"

export default {

    components: { Layout },

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
