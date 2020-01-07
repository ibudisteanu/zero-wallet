<template>

    <div>

        <div class="table">
            <div class="table-header table-row">
                <span>Height</span>
                <span>Hash</span>
                <span>Kernel Hash</span>
                <span>Time</span>
                <span>Size</span>
                <span>TX</span>
                <span>Forger</span>
            </div>
            <div v-for="blockInfo in blocksInfo" class="table-row">

                <span><router-link :to="`/explorer/block/height/${blockInfo.height}`">{{blockInfo.height}}</router-link></span>
                <span><router-link :to="`/explorer/block/hash/${blockInfo.hash.toString('hex')}`">{{blockInfo.hash.toString("hex").substr(0, 20)+'...'}}</router-link></span>
                <span>{{blockInfo.kernelHash.toString("hex").substr(0, 20)+'...'}}</span>
                <span>{{blockInfo.timestamp}}</span>
                <span>{{blockInfo.size}}</span>
                <span>{{blockInfo.txCount}}</span>
                <span>{{blockInfo.forgedBy.substr(0, 20)}}</span>

            </div>
        </div>

    </div>

</template>

<script>
export default {

    props:{
        blocksInfo: null,
    }

}
</script>

<style scoped>

    .table-row{
        grid-template-columns: 100px 1fr 1fr 50px 50px 50px 1fr ;
    }

</style>