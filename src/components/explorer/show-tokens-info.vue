<template>

    <div>

        <div class="row pd-top-10 pd-bottom-10">
            <span class="col-xs-3 col-sm-2 col-md-2 wordwrap">Name</span>
            <span class="col-xs-3 col-sm-2 col-md-2 wordwrap">Ticker</span>
            <span class="col-xs-3 col-sm-1 col-md-1 wordwrap">Hash</span>
            <span class="col-xs-3 col-sm-5 col-md-3 wordwrap">Description</span>
            <span class="hidden-xs hidden-sm col-md-2 wordwrap">Max Supply</span>
            <span class="hidden-xs col-sm-2 col-md-2 wordwrap">Supply</span>
        </div>
        <div v-for="(token, key) in tokens"
             class="row pd-top-10 pd-bottom-10"
             :key="`show-token-${key}`">

            <span class="col-xs-3 col-sm-2 col-md-2 wordwrap">
                <account-identicon v-if="key && key.length === 40" :publicKeyHash="key" :size="20" :outer-size="5"  />
                <router-link :to="`/tokens/token/${key}`">
                    {{token.name}}
                </router-link>
            </span>

            <span class="col-xs-3 col-sm-2 col-md-2 wordwrap">
                {{token.ticker}}
            </span>

            <span class="col-xs-3 col-sm-1 col-md-1 wordwrap">
                {{key.substr(0, 5)+'...'}}
            </span>

            <span class="col-xs-3 col-sm-5 col-md-3 wordwrap">
                {{token.description}}
            </span>

            <span class="hidden-xs hidden-sm col-md-2 wordwrap">
                {{token.maxSupply / Math.pow(10, token.decimalSeparator) }}

            </span>

            <span class="hidden-xs col-sm-2 col-md-2 wordwrap">
                {{token.supply / Math.pow(10, token.decimalSeparator) }}
            </span>



        </div>

    </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon";

export default {

    components: {AccountIdenticon},

    props:{
        tokens: {default: null},
    },

    methods: {


    },

}
</script>

<style scoped>


</style>