<template>

    <div>

        <div class="row pd-top-10 pd-bottom-10  fs--1 text-dark">
            <span class="d-none d-sm-block col-sm-4 col-lg-3 text-truncate">Name</span>
            <span class="d-none d-sm-block col-sm-2 col-lg-2 text-truncate">Ticker</span>
            <span class="d-none d-sm-block col-sm-2 col-lg-1 text-truncate">Hash</span>
            <span class="d-none d-lg-block col-lg-3 text-truncate">Description</span>
            <span class="d-none d-sm-block col-sm-2 col-lg-1 text-truncate">Max Supply</span>
            <span class="d-none d-sm-block col-sm-2 col-lg-2 text-truncate">Supply</span>
        </div>

        <div v-for="(asset, key) in assets" :class="`row pb-2 pt-2 fs--1 align-items-center ${key % 2 === 1 ?'bg-light':''}`"
             :key="`show-asset-${key}`">

            <span class="col-5 d-block d-sm-none text-dark">Name</span>
            <span class="col-7 col-sm-4 col-lg-3 text-truncate">
                <account-identicon v-if="key && key.length === 66" :public-key="key" size="21" outer-size="7"  />
                <router-link :to="`/assets/${key ? key : 'PBOX'}`">
                    {{asset.name}}
                </router-link>
            </span>

            <span class="col-5 d-block d-sm-none text-dark">Name</span>
            <span class="col-7 col-sm-2 col-lg-2 text-truncate">
                ${{asset.ticker}}
            </span>

            <span class="col-5 d-block d-sm-none text-dark">Hash</span>
            <span class="col-7 col-sm-2 col-lg-1 text-truncate">
                {{key}}
            </span>

            <span class="col-5 d-block d-sm-none text-dark">Description</span>
            <span class="col-7 d-sm-none d-lg-block col-lg-3 text-truncate">
                {{asset.description}}
            </span>

            <span class="col-5 d-block d-sm-none text-dark">Max Supply</span>
            <span class="col-7 col-sm-2 col-lg-1 text-truncate">
                {{asset.maxSupply / Math.pow(10, asset.decimalSeparator) }}

            </span>

            <span class="col-5 d-block d-sm-none text-dark">Supply</span>
            <span class="col-7 col-sm-2 col-lg-1 text-truncate">
                {{asset.supply / Math.pow(10, asset.decimalSeparator) }}
            </span>

        </div>

    </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon";

export default {

    components: {AccountIdenticon},

    props:{
        assets: {default: null},
    },

    methods: {


    },

}
</script>

<style scoped>


</style>
