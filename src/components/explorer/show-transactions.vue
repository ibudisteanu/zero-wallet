<template>

    <div>

        <div class="row pd-top-10 pd-bottom-10  fs--1 text-dark">
            <span class="d-none d-sm-block col-md-2 text-truncate">Hash</span>
            <span class="d-none d-md-block col-md-1 text-truncate">Time</span>
            <span class="d-none d-sm-block col-md-1 text-truncate">Confirmations</span>
            <span class="d-none d-sm-block col-md-7 text-truncate">Data</span>
        </div>

        <div id="transactions" v-for="(tx, key) in transactions"
             :class="`row pb-2 pt-2 fs--1 align-items-center ${key % 2 === 1 ?'bg-light':''}`"
             :key="`show-transaction-${key}`">

            <template v-if="typeof tx === 'string'">
                <span class="tx-hash">{{tx}}</span>
                <loading-spinner/>
            </template>
            <template v-else>
                <span class="col-4 d-block d-sm-none text-dark">Hash</span>
                <span class="col-8 col-md-2 text-truncate">
                    <router-link :to="`/explorer/tx/hash/${tx.bloom.hash}`">{{tx.bloom.hash}}</router-link>
                </span>

                <span class="col-4 d-xs-none d-sm-none d-md-none text-dark">Time</span>
                <span class="col-8 col-md-1 text-truncate">
                    <template v-if="!isPending(tx)">
                        {{ timeAgo( $store.state.blockchain.genesisTimestamp +  tx.__extra.timestamp) }}
                    </template>
                    <template v-else>
                        pending
                    </template>
                </span>

                <span class="col-4 d-block d-sm-none text-dark text-truncate">Confirmations</span>
                <span class="col-8 col-md-1 text-truncate">
                    <template v-if="!isPending(tx)">
                        <router-link :to="`/explorer/block/${tx.__extra.blkHeight}`">
                            {{ $store.state.blockchain.end - tx.__extra.blkHeight }}
                        </router-link>
                    </template>
                    <template v-else>
                        pending
                    </template>
                </span>

                <span class="col-4 d-block d-sm-none text-dark text-truncate">Data</span>
                <span class="col-8 col-md-7">
                    <div class="input" v-for="(vin, index) in tx.base.vin "
                                             :key="`show-transaction-vin-${index}`">
                        <account-identicon :publicKeyHash="vin.bloom.publicKeyHash" size="20" outer-size="7" />
                        - <amount :token="vin.token" :value="vin.amount" />
                    </div>
                    <div class="output" v-for="(vout, index) in tx.base.vout"
                         :key="`show-transaction-vout-${index}`">
                        <account-identicon :publicKeyHash="vout.publicKeyHash" size="20" outer-size="7" />
                        <amount :token="vout.token" :value="vout.amount" />
                    </div>
                </span>

            </template>

        </div>


    </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon";
import StringHelper from "src/utils/string-helper"
import LoadingSpinner from "src/components/utils/loading-spinner";
import Amount from "src/components/wallet/amount"

export default {

    components: {AccountIdenticon, LoadingSpinner, Amount},

    props:{
        transactions: {default: null},
    },

    methods:{

        timeAgo : (timestamp) => StringHelper.timeSince( timestamp*1000, false ),
        convertToBase: (amount, token) => PandoraPay.config.coins.convertToBase( amount.toString() , token.decimalSeparator ),

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


    .input, .output{
        display: inline-block;
        padding-right: 10px;
    }

</style>
