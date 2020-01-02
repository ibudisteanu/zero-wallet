<template>

    <div class="table">

        <div v-for="(blockHash, height) in blocksHashes">

            <span>{{height}}</span>
            <span>{{blockHash.toString("hex")}}</span>

        </div>

    </div>

</template>

<script>
export default {

    props:{
        blocksHashes: null,
    }

}
</script>

<style scoped>

    .table{
        display: grid;
        grid-template-columns: 60px 1fr 100px ;
    }

</style>