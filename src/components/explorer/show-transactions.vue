<template>

    <div>

        <div class="table">
            <div class="table-header table-row">
                <span>Hash</span>
                <span>Block Height</span>
                <span>Time</span>
                <span>Size</span>
                <span>Fee</span>
                <span>Confirmations</span>
            </div>
            <div v-for="tx in transactions" class="table-row">

                <span><router-link :to="`/explorer/tx/hash/${tx.hash().toString('hex')}`">{{tx.hash().toString("hex").substr(0,45)+'...'}}</router-link></span>
                <span><router-link :to="`/explorer/block/height/${tx.__extra.height}`">{{tx.__extra.height}}</router-link></span>
                <span>{{tx.__extra.timestamp}}</span>
                <span>{{tx.size()}}</span>
                <span>{{tx.fee}}</span>
                <span>{{ $store.state.blockchain.end - tx.__extra.height -1 }}</span>
            </div>
        </div>

    </div>

</template>

<script>
    export default {

        props:{
            transactions: null,
        }

    }
</script>

<style scoped>

    .table-row{
        grid-template-columns: 1fr 100px 100px 100px 100px 140px;
    }

</style>