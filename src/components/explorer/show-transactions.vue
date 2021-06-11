<template>

    <div>
        <div class="row pd-top-10 pd-bottom-10">
            <span class="col-xs-6 col-sm-2 wordwrap">Hash</span>
            <span class="col-xs-6 col-sm-2 wordwrap">Time</span>
            <span class="col-xs-12 col-sm-8 wordwrap">Data</span>
        </div>
        <div v-for="(tx, key) in transactions"
             :class="`row pd-top-10 pd-bottom-10 ${isPending(tx) ? 'grid-primary' : ''} `"
             :key="`show-transaction-${key}`">

            <template v-if="typeof tx === 'string'">
                <span class="tx-hash">{{tx}}</span>
                <loading-spinner/>
            </template>
            <template v-else>
                <router-link :to="`/explorer/tx/hash/${tx.bloom.hash}`">

                    <span class="col-xs-6 col-sm-2 wordwrap"><router-link :to="`/explorer/tx/hash/${tx.bloom.hash}`">{{tx.bloom.hash.substr(0,10)+'...'}}</router-link></span>
                    <span class="col-xs-6 col-sm-2 wordwrap">
                    <template v-if="!isPending(tx)">
                        {{ timeAgo( $store.state.blockchain.genesisTimestamp +  tx.__extra.timestamp) }}
                    </template>
                    <template v-else>
                        pending
                    </template>
                </span>
                    <span class="col-xs-12 col-sm-8 wordwrap">
                    <div class="input" v-for="(vin, index) in tx.base.vin "
                         :key="`show-transaction-vin-${index}`">
                        <account-identicon :publicKeyHash="vin.bloom.publicKeyHash" size="20" outer-size="7" />
                        <span class="amount vertical-center">-{{$store.getters.addressesContains(tx) ? convertToBase(vin.amount) : '?'}} {{vin.token}} </span>
                    </div>
                    <div class="output" v-for="(vout, index) in tx.base.vout"
                         :key="`show-transaction-vout-${index}`">
                        <account-identicon :publicKeyHash="vout.publicKeyHash" size="20" outer-size="7" />
                        <span class="amount vertical-center">{{$store.getters.addressesContains(tx) ? convertToBase(vout.amount) : '?'}} {{vout.token}}</span>
                    </div>
                </span>
                </router-link>
            </template>

        </div>

    </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon";
import StringHelper from "src/utils/string-helper"
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

    components: {AccountIdenticon, LoadingSpinner},

    props:{
        transactions: {default: null},
    },

    methods:{

        timeAgo : (timestamp) => StringHelper.timeSince( timestamp*1000, false ),
        convertToBase: (amount) => PandoraPay.config.coins.convertToBase( amount.toString() ),

        isPending(tx){
            if (!tx || typeof tx === "string") return false
            return typeof tx.__extra.blkHeight === "undefined"
        }

    }

}
</script>

<style scoped>

    .tx-hash{
        display: inline-block;
    }

    .amount{
        display: inline-block;
    }

    .input, .output{
        display: inline-block;
        padding-right: 10px;
    }

    .amount {
    }

</style>
