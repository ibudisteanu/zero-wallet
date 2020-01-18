<template>

    <div>

        <div class="table">
            <div class="table-header table-row">
                <span>Hash</span>
                <span>Version</span>
                <span>Script Version</span>
                <span>Nonce</span>
                <span>Token</span>
                <span>Queued</span>
                <span>In</span>
                <span>Out</span>
            </div>
            <div v-for="(tx, txId) in transactionsInfo" class="table-row">

                <span><router-link :to="`/explorer/tx/hash/${txId}`">{{txId.substr(0,45)+'...'}}</router-link></span>
                <span>{{tx.version}}</span>
                <span>{{tx.scriptVersion}}</span>
                <span>{{tx.nonce}}</span>
                <span>{{tx.tokenCurrency.toString("hex")}}</span>
                <span>{{tx.queued}}</span>
                <span>{{tx.vin}}</span>
                <span>{{tx.vout}}</span>
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
        grid-template-columns: 1fr 60px 60px 100px 100px 140px 60px 60px;
    }

</style>