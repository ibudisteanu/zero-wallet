<template>

    <layout>

        <sidechains-top-bar />

        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Sidechains</h1>
                <span>PandoraPay allows offline and yet verifiable sidechains to facilitate offchain transactions and infinitely horizontal scalability.</span>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <div class="pd-top-40">
                    <span>Proposed future hard forks:</span> <br/>
                    <p>
                        PandoraPay <strong>TRADING Hardfork</strong> will allow offchain trading. <br/>
                        PandoraPay <strong>ZETHER Hardfork</strong> will allow offchain confidential and unlikable transactions. <br/>
                        PandoraPay <strong>P2PSHOP Hardfork</strong> will allow Peer to Peer shop. <br/>
                    </p>
                </div>

            </div>
        </div>
    </layout>

</template>

<script>

import SidechainsTopBar from "./sidechains-top-bar"
import Layout from "src/components/layout/layout"

export default {

    components: { Layout, SidechainsTopBar },

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
