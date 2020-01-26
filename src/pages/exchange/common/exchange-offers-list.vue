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

    </div>
</template>

<script>
import Consensus from "src/consensus/consensus"
import ShowExchangeOffers from "src/components/explorer/show-exchange-offers"
export default {

    components: {ShowExchangeOffers},

    props:{
        type: 0,
    },

    computed:{

        count(){
            return this.$store.state.exchange[  this.type === 0 ? 'buy' : 'sell' ].count || 0;
        },

        offers(){

            const offers = this.$store.state.exchange[  this.type === 0 ? 'buy' : 'sell' ].offers || {};

            const out = {};
            for (const key in offers){
                const offer = this.$store.state.exchange.list[ key ];
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