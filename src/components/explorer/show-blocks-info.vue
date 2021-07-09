<template>

    <div>
        <div class="row pd-top-10 pd-bottom-10  fs--1 text-dark">
            <span class="d-none d-sm-block col-sm-3 col-md-3 text-truncate">Hash</span>
            <span class="d-none d-md-block col-md-3 text-truncate">Kernel Hash</span>
            <span class="d-none d-sm-block col-sm-2 col-md-1 text-truncate">Height</span>
            <span class="d-none d-sm-block col-sm-2 col-md-1 text-truncate">Time</span>
            <span class="d-none d-sm-block col-sm-2 col-md-1 text-truncate">Size</span>
            <span class="d-none d-sm-block col-sm-1 col-md-1 text-truncate">TX</span>
            <span class="d-none d-sm-block col-sm-2 col-md-1 text-truncate">Forged</span>
        </div>
        <div v-for="(blockInfo, key) in blocksInfo" :class="`row pb-2 pt-2 fs--1 align-items-center ${key % 2 === 1 ?'bg-light':''}`"
             :key="`show-block-${key}`">

            <span class="col-6 d-block d-sm-none text-dark">Hash</span>
            <span class="col-6 col-sm-3 col-md-3 text-truncate">
                <router-link :to="`/explorer/block/${blockInfo.hash}`">{{blockInfo.hash}}</router-link>
            </span>

            <span class="col-6 d-xs-none d-sm-none d-md-none text-dark">Kernel Hash</span>
            <span class="col-6 d-xs-none d-sm-none d-md-block  col-md-3 text-truncate">
                {{blockInfo.kernelHash}}
            </span>

            <span class="col-6 d-block d-sm-none text-dark">Height</span>
            <span class="col-3 col-sm-2 col-md-1 text-truncate">
                <router-link :to="`/explorer/block/${blockInfo.height}`">{{blockInfo.height}}</router-link>
            </span>

            <span class="col-6 d-block d-sm-none text-dark">Timestamp</span>
            <span class="col-2 col-sm-2 col-md-1  text-truncate">
                {{timeAgo( $store.state.blockchain.genesisTimestamp +  blockInfo.timestamp)  }}
            </span>

            <span class="col-6 d-block d-sm-none text-dark">Size</span>
            <span class="col-3 col-sm-2 col-md-1  text-truncate"> {{formatBytes(blockInfo.size)}} </span>

            <span class="col-6 d-block d-sm-none text-dark">Transactions</span>
            <span class="col-2 col-sm-1 col-md-1  text-truncate">{{blockInfo.txs}} </span>

            <span class="col-6 d-block d-sm-none text-dark">Forged By</span>
            <span class="col-2 col-sm-2 col-md-1  text-truncate">
                <account-identicon  :publicKeyHash="blockInfo.forger" :size="20" :outer-size="5"  />
            </span>
        </div>

    </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon";
import StringHelper from "src/utils/string-helper"

export default {

    components: {AccountIdenticon},

    props:{
        blocksInfo: {default: null},
    },

    methods: {

        timeAgo : (timestamp) => StringHelper.timeSince( timestamp*1000, false ),
        formatBytes: (bytes) => StringHelper.formatBytes(bytes, 1),

    },

}
</script>

<style scoped>


</style>
