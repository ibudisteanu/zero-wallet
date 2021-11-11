<template>

    <div>

        <div class="row pd-top-10 pd-bottom-10  fs--1 text-dark">
            <span class="d-none d-sm-block col-sm-5 col-lg-3 text-truncate">Name</span>
            <span class="d-none d-sm-block col-sm-3 col-lg-2 text-truncate">Ticker</span>
            <span class="d-none d-sm-block col-sm-4 col-lg-2 text-truncate">Hash</span>
            <span class="d-none d-lg-block col-lg-5 text-truncate">Description</span>
        </div>

        <div v-for="(assetInfo, key) in assetsInfo" :class="`row pb-2 pt-2 fs--1 align-items-center ${key % 2 === 0 ?'bg-light':''}`"
             :key="`show-asset-${key}`">

            <span class="col-5 d-block d-sm-none text-dark">Name</span>
            <span class="col-7 col-sm-4 col-lg-3 text-truncate">
                <account-identicon v-if="assetInfo.hash" :hash="assetInfo.hash" size="21" outer-size="7"  />
                <router-link :to="`/explorer/asset/${assetInfo.hash}`">
                    {{assetInfo.name}}
                </router-link>
            </span>

            <span class="col-5 d-block d-sm-none text-dark">Name</span>
            <span class="col-7 col-sm-2 col-lg-2 text-truncate">
                ${{assetInfo.ticker}}
            </span>

            <span class="col-5 d-block d-sm-none text-dark">Hash</span>
            <span class="col-7 col-sm-2 col-lg-2 text-truncate">
                {{assetInfo.hash}}
            </span>

            <span class="col-5 d-block d-sm-none text-dark">Description</span>
            <span class="col-7 d-sm-none d-lg-block col-lg-5 text-truncate">
                {{assetInfo.description}}
            </span>

        </div>

    </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon";

export default {

    components: {AccountIdenticon},

    props:{
        assetsInfo: {default: null},
    },

    methods: {


    },

}
</script>

<style scoped>


</style>
