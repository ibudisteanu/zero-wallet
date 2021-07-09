<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Transaction Explorer</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>
                <div v-else>

                    <h3 class="wordwrap">Transaction {{height ? height : hash}} </h3>

                    <template v-if="!loaded || !tx">
                        <loading-spinner v-if="!loaded"/>
                    </template>
                    <template v-else>
                        <div class="table">
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">TX Height</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">
                                    <template v-if="tx.__extra.height">
                                        {{tx.__extra.height}}
                                    </template>
                                    <template v-else>
                                        -
                                    </template>
                                </span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Block Height</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">
                                    <template v-if="tx.__extra.blkHeight ">
                                        <router-link :to="`/explorer/block/${tx.__extra.blkHeight}`">{{tx.__extra.blkHeight}}</router-link>
                                    </template>
                                    <template v-else>
                                        -
                                    </template>
                                </span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Block Timestamp</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">
                                    <template v-if="tx.__extra.timestamp">
                                        {{timeAgo( $store.state.blockchain.genesisTimestamp + tx.__extra.timestamp) }}
                                        <i class="fa fa-clock"></i>
                                    </template>
                                    <template v-else>
                                        -
                                    </template>
                                </span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Confirmations</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">
                                    <template v-if="tx.__extra.blkHeight" >
                                        {{ $store.state.blockchain.end - tx.__extra.blkHeight -1 }}
                                        <i v-if="$store.state.blockchain.end - tx.__extra.blkHeight -1 > 8" class="fa fa-check"></i>
                                    </template>
                                    <template v-else>
                                        -
                                    </template>
                                </span>
                            </div>
                            <div v-if="tx.__extra.mempool" class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Mem Pool</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">Yes</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Nonce</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{tx.base.nonce}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Unlock Time</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{tx.unlockTime}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Data</span>
                                <div class="col-xs-7 col-sm-9 wordwrap">
                                    <div v-for="(vin, index) in tx.base.vin" class="input"
                                         :key="`transaction-explorer-vin-${index}`">
                                        <account-identicon :publicKeyHash="vin.bloom.publicKeyHash" size="20" outer-size="5" />
                                        <span class="amount vertical-center">-{{$store.getters.addressesContains(tx) ? convertToBase(vin.amount) : '?'}} {{vin.token}} </span>
                                    </div>
                                    <div v-for="(vout, index) in tx.base.vout" class="input"
                                         :key="`transaction-explorer-vout-${index}`">
                                        <account-identicon :publicKeyHash="vout.publicKeyHash" size="20" outer-size="5" />
                                        <span class="amount vertical-center">{{$store.getters.addressesContains(tx) ? convertToBase(vout.amount) : '?'}} {{vout.token}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Extra Message</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{tx.__extra.extra}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Version</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{tx.version}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Script Version</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{tx.base.txScript}}</span>
                            </div>
                            <div class="row pd-top-40 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">JSON</span>
                                <textarea class="col-xs-7 col-sm-9" rows="20">{{ tx }}</textarea>
                            </div>
                            <div class="row pd-top-40 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Binary</span>
                                <textarea class="col-xs-7 col-sm-9" rows="20">{{ tx.__extra.serialized }}</textarea>
                            </div>
                        </div>

                    </template>

                </div>


            </div>
        </div>
    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import Consensus from "src/consensus/consensus"
import LoadingSpinner from "src/components/utils/loading-spinner";
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import StringHelper from "src/utils/string-helper"

export default {

    components: {Layout, LoadingSpinner, AccountIdenticon},

    data(){
        return {
            error: '',
            loaded: false,
        }
    },

    computed:{

        height(){
            return this.$route.params.height;
        },
        hash(){
            return this.$route.params.hash;
        },

        tx(){

            let tx;
            if (this.height !== undefined) tx = this.$store.state.transactions.txsByHeight[this.height];
            if (this.hash) tx = this.$store.state.transactions.txsByHash[this.hash];

            return tx;

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
