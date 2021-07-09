<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Token Explorer</h1>

                <div v-if="error" class="alert alert-danger border-2 d-flex align-items-center">
                    <div class="bg-white me-3 icon-item"><i class="fa fa-times"></i> </div>
                    <p class="mb-0 flex-1">{{error}}</p>
                </div>

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
                                <span class="col-xs-5 col-sm-3 wordwrap">Decimal Separator</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{token.decimalSeparator}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Max Supply</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{token.maxSupply / Math.pow(10, token.decimalSeparator)}}</span>
                            </div>
                            <div class="row pd-top-10 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">Supply</span>
                                <span class="col-xs-7 col-sm-9 wordwrap">{{token.supply / Math.pow(10, token.decimalSeparator) }}</span>
                            </div>
                            <div class="row pd-top-40 pd-bottom-10">
                                <span class="col-xs-5 col-sm-3 wordwrap">JSON</span>
                                <textarea class="col-xs-7 col-sm-9" rows="20">{{ token }}</textarea>
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
        return{
            loaded: false,

            error: '',
        }
    },

    computed:{
        hash(){
            return this.$route.params.hash||'';
        },
        token(){
            return this.$store.state.tokens.list[this.hash];
        },
    },

    methods: {

        async loadToken() {

            try{
                this.loaded = false

                if (!this.hash) throw 'Token hash was not specified';

                await Consensus.syncPromise;

                await Consensus.getTokenByHash(this.hash);

                this.loaded = true

            }catch(err){
                this.error = err.toString()
            }

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
