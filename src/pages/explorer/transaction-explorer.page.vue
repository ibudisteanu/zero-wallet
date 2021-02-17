<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Transaction Explorer</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <div v-if="!error">

                    <h3 class="wordwrap">Transaction {{height ? height : hash}} </h3>

                    <loading-spinner v-if="!tx"/>
                    <div v-else>
                        <div class="table">
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Hash</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{tx.hash().toString("hex")}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Block Height</span>
                                <span class="col-xs-7 col-sm-9 wordwrap" v-if="tx.__extra.height "><router-link :to="`/explorer/block/height/${tx.__extra.height}`">{{tx.__extra.height}}</router-link></span>
                                <span class="col-xs-7 col-sm-9 wordwrap" v-else>-</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Block Time</span>
                                <span class="col-xs-7 col-sm-9 wordwrap" v-if="tx.__extra.timestamp">{{timeAgo( $store.state.blockchain.genesisTimestamp + tx.__extra.timestamp) }}</span>
                                <span class="col-xs-7 col-sm-9 wordwrap" v-else>-</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Confirmations</span>
                                <span class="col-xs-7 col-sm-9 wordwrap" v-if="tx.__extra.height">{{ $store.state.blockchain.end - tx.__extra.height -1 }}</span>
                                <span class="col-xs-7 col-sm-9 wordwrap" v-else>-</span>
                            </div>
                            <div v-if="tx.__extra.memPool" class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-7 col-sm-9 wordwrap">Mem Pool</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">Yes</span>
                            </div>
                            <div v-if="tx.__extra.memPool" class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Mem Pool Queued</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{tx.__extra.memPoolQueued ? 'Yes' : 'No'}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Nonce</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{tx.nonce}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Unlock Time</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{tx.unlockTime}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Data</span>
                                <div class="col-xs-7 col-sm-9 wordwrap">
                                    <div v-for="(vin, index) in tx.vin" class="input"
                                         :key="`transaction-explorer-vin-${index}`">
                                        <account-identicon :publicKeyHash="vin.publicKeyHash" size="20" outer-size="5" />
                                        <span class="amount vertical-center">{{$store.getters.addressesContains(tx) ? convertToBase(-vin.amount) : '?'}} {{vin.tokenCurrency.toString('hex')}} </span>
                                    </div>
                                    <div v-for="(vout, index) in tx.vout" class="input"
                                         :key="`transaction-explorer-vout-${index}`">
                                        <account-identicon :publicKeyHash="vout.publicKeyHash" size="20" outer-size="5" />
                                        <span class="amount vertical-center">{{$store.getters.addressesContains(tx) ? convertToBase(vout.amount) : '?'}} {{vout.tokenCurrency.toString('hex')}}</span>
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
                                <span class="col-xs-7 col-sm-9 wordwrap">{{tx.scriptVersion}}</span>
                            </div>
                            <div class="row pd-top-40 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">JSON</span>
                                <textarea class="col-xs-7 col-sm-9" rows="20">{{ tx.toJSON() }}</textarea>
                            </div>
                        </div>

                    </div>

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

export default {

    components: {Layout, LoadingSpinner, AccountIdenticon},

    data(){
        return {
            error: '',
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
            if (this.height) tx = this.$store.state.transactions.listByHeight[this.height];
            if (this.hash) tx = this.$store.state.transactions.list[this.hash];

            return tx;

        },

    },

    methods: {

        async loadTransaction(){

            if (this.height === undefined && !this.hash){
                this.error = 'Tx height/hash was not specified';
                return;
            }
            this.error = '';

            await Consensus.initPromise;

            try{
                if (this.height !== undefined) await Consensus.getTransaction(this.height);
                if (this.hash ) await Consensus.getTransactionByHash(this.hash);
            }catch(err){
                this.error = err.message;
            }

        },

        convertToBase(amount){
            return PandoraPay.argv.transactions.coins.convertToBase(amount);
        },

        timeAgo(timestamp){
            return PandoraLibrary.helpers.StringHelper.timeSince( timestamp*1000 );
        },

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

    .table-row{
        grid-template-columns: 200px 1fr;
    }

    .identicon{
    }

    .input, .output{
        display: inline-block;
    }

    .amount{
        display: inline-block;
    }

    @media (min-width: 481px) and  (max-width: 767px) {

        .table-row{
            grid-template-columns: 150px 1fr;
        }

    }

    @media (max-width: 481px) {
        .table-row{
            grid-template-columns: 100px 1fr;
        }
    }

</style>