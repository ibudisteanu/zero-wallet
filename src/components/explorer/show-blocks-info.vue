<template>

    <div>

        <div class="table">
            <div class="table-header table-row">
                <span>Hash</span>
                <span class="hide-tablet hide-mobile">Kernel Hash</span>
                <span>Height</span>
                <span>Time</span>
                <span>Size</span>
                <span>TX</span>
                <span>Forge</span>
            </div>
            <div v-for="blockInfo in blocksInfo" class="table-row">

                <span><router-link :to="`/explorer/block/hash/${blockInfo.hash.toString('hex')}`">{{blockInfo.hash.toString("hex").substr(0, 20)+'...'}}</router-link></span>
                <span class="hide-tablet hide-mobile">{{blockInfo.kernelHash.toString("hex").substr(0, 20)+'...'}}</span>
                <span><router-link :to="`/explorer/block/height/${blockInfo.height}`">{{blockInfo.height}}</router-link></span>
                <span>{{blockInfo.timestamp}}</span>
                <span>{{blockInfo.size}}</span>
                <span>{{blockInfo.txCount}}</span>
                <span> <account-identicon  :address="blockInfo.forgedBy" :size="20" :outer-size="5"  /> </span>

            </div>
        </div>

    </div>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon";

export default {

    components: {AccountIdenticon},

    props:{
        blocksInfo: null,
    },

    methods: {

    },

}
</script>

<style scoped>

    .table-row{
        grid-template-columns: 1fr 1fr 90px 50px 50px 50px 60px ;
    }

    @media (max-width: 767px) {

        .table-row{
            grid-template-columns: 1fr 90px 50px 50px 50px 60px ;
        }

    }

</style>