<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Exchange Sell coins</h1>

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
            listings: [
                {
                    name: "Trade Sell 1",
                    description: "Low fee",
                    price: "10 USD",
                    escrow: "XXXXXX",
                    acceptedPayments: ["paypal", "alipay", "btc", "eth"],
                },

                {
                    name: "Trade Sell 2",
                    description: "Very low fee, instant payment",
                    price: "15 USD",
                    acceptedPayments: ["google pay", "apple pay"],
                }

            ],
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
