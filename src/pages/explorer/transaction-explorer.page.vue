<template>

    <layout>

        <layout-title icon="fa-file-invoice-dollar" title="Transaction" >View a transaction.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0 text-truncate">Tx {{height ? height : hash}}  </h5>
                        <loading-spinner v-if="!loaded"/>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 fs--1">

                <alert-box v-if="error" type="error">{{error}}</alert-box>
                <div v-else-if="tx">

                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Height</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <template v-if="tx.__extra.height">
                                {{tx.__extra.height}}
                            </template>
                            <template v-else>
                                -
                            </template>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Block Height</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <template v-if="tx.__extra.blkHeight ">
                                <router-link :to="`/explorer/block/${tx.__extra.blkHeight}`">{{tx.__extra.blkHeight}}</router-link>
                            </template>
                            <template v-else>
                                -
                            </template>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Block Timestamp</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <template v-if="tx.__extra.timestamp">
                                {{timeAgo( $store.state.blockchain.genesisTimestamp + tx.__extra.timestamp) }}
                                <i class="fa fa-clock"></i>
                            </template>
                            <template v-else>
                                -
                            </template>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Confirmations</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <template v-if="tx.__extra.blkHeight" >
                                {{ $store.state.blockchain.end - tx.__extra.blkHeight -1 }}
                                <i v-if="$store.state.blockchain.end - tx.__extra.blkHeight -1 > 8" class="fa fa-check"></i>
                            </template>
                            <template v-else>
                                -
                            </template>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Mem Pool</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.__extra.mempool ? 'YES': ' No' }}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Nonce</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.base.nonce}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Unlock Time</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.unlockTime}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Data</span>
                        <div class="col-7 col-sm-9">
                            <div v-for="(vin, index) in tx.base.vin" class="input"
                                 :key="`transaction-explorer-vin-${index}`">
                                <account-identicon :publicKeyHash="vin.bloom.publicKeyHash" size="20" outer-size="5" />
                                <amount :value="vin.amount" :token="vin.token" />
                            </div>
                            <div v-for="(vout, index) in tx.base.vout" class="input"
                                 :key="`transaction-explorer-vout-${index}`">
                                <account-identicon :publicKeyHash="vout.publicKeyHash" size="20" outer-size="5" />
                                <amount :value="vout.amount" :token="vout.token" />
                            </div>
                        </div>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Extra Message</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.__extra.extra}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Version</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.version}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Script Version</span>
                        <span class="col-7 col-sm-9 text-truncate">{{tx.base.txScript}}</span>
                    </div>

                </div>


            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import Consensus from "src/consensus/consensus"
import LoadingSpinner from "src/components/utils/loading-spinner";
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import StringHelper from "src/utils/string-helper"
import Amount from "src/components/wallet/amount"
import AlertBox from "src/components/utils/alert-box"

export default {

    components: {Layout, LoadingSpinner, AccountIdenticon, Amount, AlertBox, LayoutTitle},

    data(){
        return {
            error: '',
            loaded: false,
        }
    },

    computed:{

        query(){
            return this.$route.params.query;
        },
        height(){
            if (this.query && this.query.length < 10)
                return Number.parseInt(this.query)
        },
        hash(){
            if (this.query && this.query.length === 64)
                return this.query
        },

        tx(){
            if (this.height !== undefined) return this.$store.state.transactions.txsByHeight[this.height];
            if (this.hash) return this.$store.state.transactions.txsByHash[this.hash];
        },

    },

    methods: {

        async loadTransaction(){

            try{
                this.loaded = false;
                this.error = ""

                if (this.height === undefined && !this.hash)
                    throw 'Tx height/hash was not specified';

                await Consensus.syncPromise;

                if (this.height !== undefined) await Consensus.getTransactionByHeight(this.height);
                if (this.hash ) await Consensus.getTransactionByHash(this.hash);

            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
            }

        },

        convertToBase: (amount) => PandoraPay.config.coins.convertToBase( amount.toString() ),
        timeAgo : (timestamp) => StringHelper.timeSince( timestamp*1000, false ),

    },

    watch: {
        '$route' (to, from) {
            return this.loadTransaction();
        }
    },

    mounted(){
        return this.loadTransaction();
    }

}
</script>

<style scoped>

    .input, .output{
        display: inline-block;
    }

    .amount{
        display: inline-block;
    }

</style>
