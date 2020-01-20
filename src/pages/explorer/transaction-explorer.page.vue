<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Transaction Explorer</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <div v-if="!error">

                    <h3>Transaction {{height ? height : hash}} </h3>

                    <div v-if="!tx">
                        <loading-spinner/>
                    </div>
                    <div v-else>
                        <div class="table">
                            <div class="table-row">
                                <span>Hash</span>
                                <span>{{tx.hash().toString("hex")}}</span>
                            </div>
                            <div class="table-row">
                                <span>Block Height</span>
                                <span>{{tx.__extra.height}}</span>
                            </div>
                            <div class="table-row">
                                <span>Confirmations</span>
                                <span>{{ tx.__extra.height ? $store.state.blockchain.end - tx.__extra.height -1 : '-' }}</span>
                            </div>
                            <div v-if="tx.__extra.memPool" class="table-row">
                                <span>Mem Pool</span>
                                <span>Yes</span>
                            </div>
                            <div v-if="tx.__extra.memPoolQueued" class="table-row">
                                <span>Confirmations</span>
                                <span>{{tx.__extra.memPoolQueued ? 'Yes' : 'No'}}</span>
                            </div>
                            <div class="table-row">
                                <span>Nonce</span>
                                <span>{{tx.nonce}}</span>
                            </div>
                            <div class="table-row">
                                <span>Token Currency </span>
                                <span>{{tx.tokenCurrency.toString("hex")}}</span>
                            </div>
                            <div class="table-row">
                                <span>Unlock Time</span>
                                <span>{{tx.unlockTime}}</span>
                            </div>
                            <div class="table-row">
                                <span>In</span>
                                <div v-for="vin in tx.vin ">
                                    <account-identicon :publicKey="vin.publicKey" size="20" outer-size="20" />
                                    <span class="amount vertical-center">-{{convertToBase(vin.amount)}}</span>
                                </div>
                            </div>
                            <div class="table-row">
                                <span>Out</span>
                                <div v-for="vout in tx.vout">
                                    <account-identicon :publicKeyHash="vout.publicKeyHash" size="20" outer-size="20" />
                                    <span class="amount vertical-center">{{convertToBase(vout.amount)}}</span>
                                </div>
                            </div>
                            <div class="table-row">
                                <span>Version</span>
                                <span>{{tx.version}}</span>
                            </div>
                            <div class="table-row">
                                <span>Script Version</span>
                                <span>{{tx.scriptVersion}}</span>
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

    components: {Layout, Consensus, LoadingSpinner, AccountIdenticon},

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
                this.error = 'Tx index was not specified';
                return;
            }

            await Consensus.initPromise;

            if (this.height !== undefined)  return Consensus.getTransaction(this.height);
            if (this.hash ) return Consensus.getTransactionByHash(this.hash);

        },

        convertToBase(amount){
            return global.apacache._scope.argv.transactions.coins.convertToBase(amount);
        }

    },

    watch: {
        '$route' (to, from) {
            return this.loadTransaction();
        }
    },

    async mounted(){

        return this.loadTransaction();

    }

}
</script>

<style scoped>

    .table-row{
        grid-template-columns: 200px 1fr;
    }

    .identicon{
        display: inline;
    }

    .amount{
        display: inline-block;
    }


</style>