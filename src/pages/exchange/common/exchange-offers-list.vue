<template>
    <div>

        <div class="title">

            <h1>Exchange {{type === 0 ? 'Buy' : 'Sell'}} coins</h1>

            <router-link :to="`/exchange/${type === 0 ? 'buy' : 'sell'}/add-offer`">
                <div class="btn right-float">
                    <div class="btn-round"  v-tooltip.bottom="`Create a ${type === 0 ? 'Buy' : 'Sell'} Buy Offer`" >
                        <i class="fa fa-plus"></i>
                    </div>
                </div>
            </router-link>

        </div>

        <h3>Offers List {{count}}</h3>

        <show-exchange-offers :offers="offers" />

        <div class="centered" v-if="next">
            <loading-button class="button-width-inherit" @submit="handleViewMore" icon="fa fa-cloud-download-alt" text="View more..."/>
        </div>

    </div>
</template>

<script>
import Consensus from "src/consensus/consensus"
import ShowExchangeOffers from "src/components/explorer/show-exchange-offers"
import LoadingButton from "src/components/utils/loading-button.vue"

export default {

    components: {ShowExchangeOffers, LoadingButton},

    props:{
        type: 0,
    },

    computed:{

        next(){
            return this.$store.state.exchange[  this.type === 0 ? 'buy' : 'sell' ].next;
        },

        count(){
            return this.$store.state.exchange[  this.type === 0 ? 'buy' : 'sell' ].count || 0;
        },

        offersIds(){
            return this.$store.state.exchange[  this.type === 0 ? 'buy' : 'sell' ].offers || {};
        },

        offers(){

            const offers = this.offersIds;

            const out = {};
            for (const key in offers){
                const offer = this.$store.state.exchange.list[ this.type + '_' + key ];
                if (offer)
                    out[key] = offer;
            }

            return out;
        }

    },

    methods: {

        async startDownloadingExchangeOffers() {
            await Consensus.initPromise;
            await Consensus.startDownloadingExchangeOffers();
        },

        async handleViewMore(resolve){

            try{
                await Consensus._downloadExchangeOffersSpecific( { type: this.type, index: next } )
            }finally{
                resolve(true);
            }

        }

    },

    watch: {
        '$route' (to, from) {
            return this.startDownloadingExchangeOffers();
        }
    },

    mounted(){
        return this.startDownloadingExchangeOffers();
    },

    beforeDestroy(){
        return Consensus.stopDownloadingExchangeOffers();
    }


}
</script>

<style scoped>

    .title h1,
    .title .btn{
        display: inline-block;
    }


</style>