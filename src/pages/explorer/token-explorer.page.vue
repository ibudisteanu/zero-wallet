<template>

    <layout>

        <layout-title icon="fa fa-file-invoice-dollar" title="Explorer Token">View a specific token.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0 text-truncate">Token Explorer {{hash}}  </h5>
                        <loading-spinner v-if="!loaded"/>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 fs--1">

                <alert-box v-if="error" type="error">{{error}}</alert-box>

                <template v-if="token">

                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Name</span>
                        <span class="col-7 col-sm-9 text-truncate">{{token.name}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Ticker</span>
                        <span class="col-7 col-sm-9 text-truncate">{{token.ticker}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Hash</span>
                        <span class="col-7 col-sm-9 text-truncate">{{token.hash}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Description</span>
                        <span class="col-7 col-sm-9 text-truncate">{{token.description}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Decimal Separator</span>
                        <span class="col-7 col-sm-9 text-truncate">{{token.decimalSeparator}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Max Supply</span>
                        <span class="col-7 col-sm-9 text-truncate">{{token.maxSupply / Math.pow(10, token.decimalSeparator)}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Supply</span>
                        <span class="col-7 col-sm-9 text-truncate">{{token.supply / Math.pow(10, token.decimalSeparator) }}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Key</span>
                        <span class="col-7 col-sm-9 text-truncate">{{token.key}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Supply Key</span>
                        <span class="col-7 col-sm-9 text-truncate">{{token.supplyKey}}</span>
                    </div>

                </template>

            </div>
        </div>

        <div class="card mb-3" v-if="token">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">JSON Token</h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 fs--1">
                <div class="row">
                    <span class="col-4 col-sm-2 col-md-1 text-truncate">JSON</span>
                    <div class="col-8 col-sm-10 col-md-11">
                        <div class="card mb-3" >
                            <div class="card-body ">
                                <p class="mb-0  div-scrollable" style="text-align: left">{{token}}</p>
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
import LayoutTitle from "src/components/layout/layout-title"
import LoadingSpinner from "src/components/utils/loading-spinner";
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import AlertBox from "src/components/utils/alert-box"

export default {

    components: {Layout, LoadingSpinner, AccountIdenticon, AlertBox, LayoutTitle},

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

                await this.$store.state.blockchain.syncPromise;

                await this.$store.dispatch('getTokenByHash', this.hash);

            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
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
