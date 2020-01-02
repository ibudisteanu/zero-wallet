<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Blockchain Explorer</h1>

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

    methods: {



    }

}

</script>

<style scoped>

</style>