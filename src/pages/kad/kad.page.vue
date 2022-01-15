<template>

    <layout>

        <layout-title icon="fas fa-globe-americas" title="Kademlia">Decentralized Peer to Peer Network.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0 text-truncate">Info </h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 fs--1">

            </div>
        </div>

    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import AlertBox from "src/components/utils/alert-box"

export default {

    components: { Layout, AlertBox, LayoutTitle },

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
