<template>

    <layout>

        <layout-title icon="fa fa-file-invoice-dollar" title="Explorer Asset">View a specific asset.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0 text-truncate">Asset Explorer {{hash}}  </h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 fs--1">

                <alert-box v-if="error" type="error">{{error}}</alert-box>

                <template v-if="!loaded">
                    <loading-spinner/>
                </template>
                <template v-else-if="asset">

                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Name</span>
                        <span class="col-7 col-sm-9 text-truncate">{{asset.name}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Ticker</span>
                        <span class="col-7 col-sm-9 text-truncate">{{asset.ticker}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Hash</span>
                        <span class="col-7 col-sm-9 text-truncate">{{asset.hash}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Description</span>
                        <span class="col-7 col-sm-9 text-truncate">{{asset.description}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Decimal Separator</span>
                        <span class="col-7 col-sm-9 text-truncate">{{asset.decimalSeparator}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Max Supply</span>
                        <span class="col-7 col-sm-9 text-truncate">{{asset.maxSupply / Math.pow(10, asset.decimalSeparator)}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Supply</span>
                        <span class="col-7 col-sm-9 text-truncate">{{asset.supply / Math.pow(10, asset.decimalSeparator) }}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Update Key</span>
                        <span class="col-7 col-sm-9 text-truncate">{{asset.updatePublicKey}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Supply Key</span>
                        <span class="col-7 col-sm-9 text-truncate">{{asset.supplyPublicKey}}</span>
                    </div>

                </template>

            </div>
        </div>

        <div class="card mb-3" v-if="asset">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">JSON Asset</h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 fs--1">
                <div class="row">
                    <span class="col-4 col-sm-2 col-md-1 text-truncate">JSON</span>
                    <div class="col-8 col-sm-10 col-md-11">
                        <div class="card mb-3" >
                            <div class="card-body ">
                                <p class="mb-0  div-scrollable" style="text-align: left">{{asset}}</p>
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
        asset(){
            return this.$store.state.assets.list[this.hash];
        },
    },

    methods: {

        async loadAsset() {

            try{
                this.loaded = false

                if (!this.hash) throw 'Asset hash was not specified';

                await this.$store.state.blockchain.syncPromise;

                await this.$store.dispatch('getAssetByHash', this.hash);

            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
            }

        },

    },


    watch: {
        '$route' (to, from) {
            return this.loadAsset();
        }
    },

    mounted(){
        return this.loadAsset();
    }



}

</script>

<style scoped>
</style>
