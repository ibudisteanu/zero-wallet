<template>

    <div>

        <div class="row pd-top-10 pd-bottom-10">
            <span class="col-xs-4 col-sm-3 col-md-3 wordwrap">Name</span>
            <span class="col-xs-3 col-sm-2 col-md-2 wordwrap">Ticker</span>
            <span class="col-xs-5 col-sm-5 col-md-3 wordwrap">Description</span>
            <span class="hidden-xs hidden-sm col-md-2 wordwrap">Max Supply</span>
            <span class="hidden-xs col-sm-2 col-md-2 wordwrap">Supply</span>
        </div>
        <div v-for="(token, key) in tokens"
             class="row pd-top-10 pd-bottom-10"
             :key="`show-token-${key}`">

            <span class="col-xs-4 col-sm-3 col-md-3 wordwrap">
                <account-identicon v-if="key && key.length === 40" :publicKeyHash="key" :size="20" :outer-size="5"  />
                {{token.name}}
            </span>

            <span class="col-xs-3 col-sm-2 col-md-2 wordwrap">
                {{token.ticker}}
            </span>

            <span class="col-xs-5 col-sm-5 col-md-3 wordwrap">
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
        tokens: null,
    },

    methods: {


    },

}
</script>

<style scoped>


</style>