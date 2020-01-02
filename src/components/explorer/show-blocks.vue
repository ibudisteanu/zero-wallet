<template>

    <div >

        <div v-for="blockInfo in blocksInfo" class="table">

            <span>{{blockInfo.height}}</span>
            <span>{{blockInfo.hash.toString("hex").substr(0, 20)}}</span>
            <span>{{blockInfo.kernelHash.toString("hex").substr(0, 20)}}</span>
            <span>{{blockInfo.timestamp}}</span>
            <span>{{blockInfo.size}}</span>
            <span>{{blockInfo.txCount}}</span>
            <span>{{blockInfo.forgedBy.substr(0, 20)}}</span>

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

    .table{
        display: grid;
        grid-template-columns: 60px 1fr 1fr 50px 50px 50px 1fr ;
    }

</style>