<template>
    <div>
        <template v-if="!tx">
            <div>
                <span class="tx-hash">{{txHash}}</span>
                <loading-spinner/>
            </div>
        </template>
        <template v-else>

            <span class="col-4 d-block d-sm-none text-dark">Hash</span>
            <span class="col-8 col-md-2 text-truncate">
                <router-link :to="`/explorer/tx/${txHash}`">
                    {{tx.nonce}}
<!--                    {{tx.hash}}-->
                </router-link>
           </span>

            <span class="col-4 d-xs-none d-sm-none d-md-none text-dark">Time</span>
            <span class="col-8 col-md-1 text-truncate">
                <template v-if="!isPending">
                    {{ timeAgo( $store.state.blockchain.genesisTimestamp +  tx.__extra.timestamp) }}
                </template>
                <template v-else>
                    pending
                </template>
            </span>

            <span class="col-4 d-block d-sm-none text-dark text-truncate">Confirmations</span>
            <span class="col-8 col-md-1 text-truncate">
                <template v-if="!isPending">
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
                <div class="input" v-for="(vin, index) in tx.vin "
                     :key="`show-transaction-vin-${index}`">
                    <account-identicon :publicKeyHash="vin.publicKeyHash" size="20" outer-size="7" />
                    <amount :token="vin.token" :value="vin.amount" :sign="false" />
                </div>
                <div class="output" v-for="(vout, index) in tx.vout"
                     :key="`show-transaction-vout-${index}`">
                    <account-identicon :publicKeyHash="vout.publicKeyHash" size="20" outer-size="7" />
                    <amount :token="vout.token" :value="vout.amount" :sign="false" />
                </div>
            </span>

        </template>

    </div>
</template>

<script>
import StringHelper from "../../utils/string-helper";
import LoadingSpinner from "../utils/loading-spinner";
import Amount from "../wallet/amount";
import AccountIdenticon from "../wallet/account/account-identicon";

export default {

    components: {AccountIdenticon, LoadingSpinner, Amount},

    props: {
        txHash: {default: null}
    },

    computed:{

        tx(){
            return this.$store.state.transactions.txsByHash[this.txHash]
        },

        isPending(){
            const tx = this.tx
            if (!tx || typeof tx === "string" || !tx.__extra) return false
            return typeof tx.__extra.blkHeight === "undefined"
        }
    },

    methods:{
        timeAgo : (timestamp) => StringHelper.timeSince( timestamp*1000, false ),
    },

    watch: {
        txHash:{
            immediate: true,
            handler: function (to, from) {
                if (to === from) return
                return this.$store.dispatch('getTransactionByHash', to)
            }
        },
    },
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
