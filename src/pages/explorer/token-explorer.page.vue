<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Token Explorer</h1>

                <span v-if="error" class="danger">
                    {{error}}
                </span>

                <div v-if="!error">

                    <h3 class="wordwrap">Token {{hash}} </h3>

                    <div v-if="!token">
                        <loading-spinner/>
                    </div>
                    <div v-else>
                        <div class="table">
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Name</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{token.name}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Ticker</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{token.ticker}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Description</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{token.description}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Max Supply</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{token.maxSupply}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Supply</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{token.supply}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Decimal Separator</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{token.decimalSeparator}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Printer Public Key</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">
                                    <account-identicon :publicKeyHash="token.printerPublicKeyHash" size="20" outer-size="5" />
                                </span>
                            </div>
                            <div class="row pd-top-40 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">JSON</span>
                                <textarea class="col-xs-7 col-sm-9" rows="20">{{ token.toJSON() }}</textarea>
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

    computed:{
        hash(){
            return this.$route.params.hash;
        },


        token(){

            return this.$store.state.tokens.list[this.hash];

        },
    },

    methods: {

        async loadToken() {

            if (!this.hash) {
                this.error = 'Token hash was not specified';
                return;
            }

            await Consensus.initPromise;

            return Consensus.getTokenByHash(this.hash);

        },

    },


    watch: {
        '$route' (to, from) {
            return this.loadToken();
        }
    },

    mounted(){

        return this.loadToken();

    }

}

</script>

<style scoped>
</style>