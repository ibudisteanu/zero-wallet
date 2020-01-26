<template>
    <div>

        <div class="title">

            <h1>Exchange {{type === 0 ? 'Buy' : 'Sell'}} coins</h1>

            <router-link :to="`/exchange/${type === 0 ? 'buy' : 'sell'}/add-offer`">
                <div class="btn right-float">
                    <div class="btn-round" @click="createOffer" v-tooltip.bottom="`Create a ${type ? 'Buy' : 'Sell'} Buy Offer`" >
                        <i class="fa fa-plus"></i>
                    </div>
                </div>
            </router-link>

        </div>

        Offers List

    </div>
</template>

<script>
import Consensus from "src/consensus/consensus"
export default {

    props:{
        type: 0,
    },

    methods: {

        async startDownloadingExchangeOffers() {
            await Consensus.initPromise;
            await Consensus.startDownloadingExchangeOffers();
        },

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