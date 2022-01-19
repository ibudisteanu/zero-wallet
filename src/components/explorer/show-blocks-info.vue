<template>

    <div>
        <div class="row bg-200 text-900 py-2 fs--1 fw-semi-bold">
            <span class="d-none d-sm-block col-sm-2 col-md-2 text-truncate">Hash</span>
            <span class="d-none d-md-block col-md-2 text-truncate">Kernel Hash</span>
            <span class="d-none d-sm-block col-sm-2 col-md-2 text-truncate">Height</span>
            <span class="d-none d-sm-block col-sm-2 col-md-2 text-truncate">Fees</span>
            <span class="d-none d-sm-block col-sm-2 col-md-1 text-truncate">Time</span>
            <span class="d-none d-sm-block col-sm-2 col-md-1 text-truncate">Size</span>
            <span class="d-none d-sm-block col-sm-1 col-md-1 text-truncate">TX</span>
            <span class="d-none d-sm-block col-sm-1 col-md-1 text-truncate">Forged</span>
        </div>
        <div v-for="(blockInfo, key) in blocksInfo" :class="`row pb-2 pt-2 fs--1 align-items-center ${key % 2 === 0 ?'bg-light':''}`"
             :key="`show-block-${key}`">

            <span class="col-5 d-block d-sm-none text-dark">Hash</span>
            <span class="col-7 col-sm-2 col-md-2 text-truncate">
                <router-link :to="`/explorer/block/${blockInfo.hash}`">{{blockInfo.hash}}</router-link>
            </span>

            <span class="col-5 d-xs-none d-sm-none d-md-none text-dark">Kernel Hash</span>
            <span class="col-7 d-xs-none d-sm-none d-md-block  col-md-2 text-truncate">
                {{blockInfo.kernelHash}}
            </span>

            <span class="col-5 d-block d-sm-none text-dark">Height</span>
            <span class="col-7 col-sm-2 col-md-2 text-truncate">
                <router-link :to="`/explorer/block/${blockInfo.height}`">{{blockInfo.height}}</router-link>
            </span>

            <span class="col-5 d-xs-none d-sm-none d-md-none text-dark">Fees</span>
            <span class="col-7 col-sm-2 col-md-2 text-truncate">
                <amount :value="blockInfo.fees" :sign="true" :show-asset="false "/>
            </span>

            <span class="col-5 d-block d-sm-none text-dark">Timestamp</span>
            <span class="col-7 col-sm-2 col-md-1  text-truncate" v-tooltip.bottom="`${ formatTime( $store.state.blockchain.genesisTimestamp.plus( blockInfo.timestamp) ) }`" >
                {{timeAgo( $store.state.blockchain.genesisTimestamp.plus( blockInfo.timestamp) )  }}
            </span>

            <span class="col-5 d-block d-sm-none text-dark">Size</span>
            <div class="col-7 col-sm-2 col-md-1 text-truncate">
                <span v-tooltip.bottom="`${ formatBytes(blockInfo.size) }`">
                    {{formatSize(blockInfo.size)}}
                </span>
            </div>

            <span class="col-5 d-block d-sm-none text-dark">Transactions</span>
            <span class="col-7 col-sm-1 col-md-1  text-truncate">{{blockInfo.txs}} </span>

            <span class="col-5 d-block d-sm-none text-dark">Forged By</span>
            <span class="col-7 col-sm-1 col-md-1  text-truncate">
                <account-identicon  :publicKey="blockInfo.forger" size="21" outer-size="4"  />
            </span>
        </div>

    </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon";
import StringHelper from "src/utils/string-helper"
import Amount from "src/components/wallet/amount"

export default {

    components: {AccountIdenticon, Amount},

    props:{
        blocksInfo: {default: null},
    },

    methods: {

        timeAgo : (timestamp) => StringHelper.timeSince( timestamp*1000, false ),
        formatTime : (timestamp) => StringHelper.formatTime( timestamp*1000 ),
        formatSize: (bytes) => StringHelper.formatSize(bytes, 1),
        formatBytes: (bytes) => StringHelper.formatBytes(bytes),

    },

}
</script>

<style scoped>


</style>
