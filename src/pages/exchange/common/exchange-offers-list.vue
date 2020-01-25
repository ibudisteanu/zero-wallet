<template>
    <div>

        Offers List

    </div>
</template>

<script>
import Consensus from "src/consensus/consensus"
export default {

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

</style>