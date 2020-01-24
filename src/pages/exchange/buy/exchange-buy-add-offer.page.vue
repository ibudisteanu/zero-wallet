<template>
    <layout>

        <exchange-top-bar />

        <div class="container pd-top-40">
            <div class="boxed ">
                <h1>Exchange Buy Create Offer</h1>
            </div>
        </div>

    </layout>
</template>

<script>
import Layout from "src/components/layout/layout"
import ExchangeTopBar from "./../common/exchange-top-bar"
import ExchangeAddOfferForm from "./../common/exchange-add-offer-form"

export default {

    components: { Layout, ExchangeTopBar, ExchangeAddOfferForm },
}
</script>

<style scoped>
</style>