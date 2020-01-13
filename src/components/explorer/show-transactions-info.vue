<template>

    <div>

        <div class="table">
            <div class="table-header table-row">
                <span>Hash</span>
                <span>Queued</span>
                <span>Fee</span>
                <span>Amount</span>
            </div>
            <div v-for="tx in transactionsInfo" class="table-row">

                <span><router-link :to="`/explorer/tx/hash/${tx.hash().toString('hex')}`">{{tx.hash().toString("hex").substr(0,45)+'...'}}</router-link></span>
                <span>{{tx.queued}}</span>
                <span>{{tx.fee}}</span>
                <span>{{tx.amount}}</span>
            </div>
        </div>

    </div>

</template>

<script>
export default {

    props:{
        transactionsInfo: null,
    }

}
</script>

<style scoped>

    .table-row{
        grid-template-columns: 1fr 100px 100px 100px 100px 140px;
    }

</style>