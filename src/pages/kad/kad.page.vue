<template>

    <layout>

        <kad-top-bar />

        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>KAD</h1>
                <span>PandoraPay will use PandoraProtocol to build a decentralized and distributed network.</span>

                <div v-if="error" class="alert alert-danger border-2 d-flex align-items-center">
                    <div class="bg-white me-3 icon-item"><i class="fa fa-times"></i> </div>
                    <p class="mb-0 flex-1">{{error}}</p>
                </div>

                <div class="pd-top-40">
                    <span>Proposed future hard forks:</span>
                    <p>
                        PandoraPay <strong>ZETHER Hardfork</strong> will allow confidential and unlikable transactions. <br/>
                        PandoraPay <strong>DEX Hardfork</strong> will allow dex. <br/>
                        PandoraPay <strong>P2PDEX Hardfork</strong> will allow Peer to Peer DEX. <br/>
                        PandoraPay <strong>P2PBAZAAR Hardfork</strong> will allow Peer to Peer Bazaar. <br/>
                    </p>
                </div>

            </div>
        </div>
    </layout>

</template>

<script>

import KadTopBar from "./kad-top-bar"
import Layout from "src/components/layout/layout"

export default {

    components: { Layout, KadTopBar },

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
