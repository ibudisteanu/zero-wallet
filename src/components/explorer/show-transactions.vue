<template>

    <div>

        <div class="table">
            <div class="table-header table-row">
                <span>Hash</span>
                <span>Time</span>
                <span>Size</span>
                <span>Fee</span>
                <span>Confirmations</span>
            </div>
            <div v-for="tx in transactions" class="table-row">

                <span><router-link :to="`/explorer/tx/hash/${tx.hash().toString('hex')}`">{{tx.hash().toString("hex").substr(0, 20)}}</router-link></span>
                <span>{{-1}}</span>
                <span>{{tx.size()}}</span>
                <span>{{tx.fee}}</span>
                <span>{{-1}}</span>
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
        grid-template-columns: 1fr 60px 60px 60px 60px;
    }

</style>