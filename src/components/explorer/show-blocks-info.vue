<template>

    <div>

        <div class="row pd-top-10 pd-bottom-10">
            <span class="hidden-xs col-sm-6 col-md-3 wordwrap">Hash</span>
            <span class="hidden-xs hidden-sm col-md-3 wordwrap">Kernel Hash</span>
            <span class="col-xs-4 col-sm-1 col-md-1 wordwrap">Height</span>
            <span class="col-xs-4 col-sm-1 col-md-1 wordwrap">Time</span>
            <span class="hidden-xs col-sm-2 col-md-2 wordwrap">Size</span>
            <span class="col-xs-2 col-sm-1 col-md-1 wordwrap">TX</span>
            <span class="col-xs-2 col-sm-1 col-md-1 wordwrap">Forge</span>
        </div>
        <div v-for="(blockInfo, key) in blocksInfo"
             class="row pd-top-10 pd-bottom-10"
             :key="`show-block-${key}`">

            <span class="hidden-xs col-sm-6 col-md-3 wordwrap">
                <router-link :to="`/explorer/block/hash/${blockInfo.hash}`">{{blockInfo.hash.substr(0, 20)+'...'}}</router-link>
            </span>
            <span class="hidden-xs hidden-sm col-md-3 wordwrap">
                {{blockInfo.kernelHash.substr(0, 20)+'...'}}
            </span>
            <span class="col-xs-4 col-sm-1 col-md-1 wordwrap">
                <router-link :to="`/explorer/block/height/${blockInfo.height}`">{{blockInfo.height}}</router-link>
            </span>
            <span class="col-xs-4 col-sm-1 col-md-1 wordwrap">
                {{timeAgo( $store.state.blockchain.genesisTimestamp +  blockInfo.timestamp)  }}
            </span>
            <span class="hidden-xs col-sm-2 col-md-2 wordwrap">
                {{formatBytes(blockInfo.size)}}
            </span>
            <span class="col-xs-2 col-sm-1 col-md-1 wordwrap">
                {{blockInfo.txs}}
            </span>
            <span class="col-xs-2 col-sm-1 col-md-1 wordwrap">
                <account-identicon  :publicKeyHash="blockInfo.forgedBy" :size="20" :outer-size="5"  />
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

        timeAgo(timestamp){
            return StringHelper.timeSince( timestamp*1000, false );
        },

        formatBytes(bytes){
            return StringHelper.formatBytes(bytes, 1);
        }

    },

}
</script>

<style scoped>


</style>
