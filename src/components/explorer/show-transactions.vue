<template>

    <div>

        <div class="table">
            <div class="table-header table-row">
                <span>Hash</span>
                <span>Block</span>
                <span>Confirmations</span>
                <span>Time</span>
                <span>Size</span>
                <span>Fee</span>
                <span>In</span>
                <span>Out</span>
            </div>
            <div v-for="tx in transactions" class="table-row">

                <span><router-link :to="`/explorer/tx/hash/${tx.hash().toString('hex')}`">{{tx.hash().toString("hex").substr(0,20)+'...'}}</router-link></span>
                <span>
                    <router-link v-if="tx.__extra.height" :to="`/explorer/block/height/${tx.__extra.height}`">{{tx.__extra.height}}</router-link>
                </span>
                <span>
                    <template v-if="tx.__extra.height">
                        {{ $store.state.blockchain.end - tx.__extra.height -1 }}
                    </template>
                </span>
                <span>{{tx.__extra.timestamp}}</span>
                <span>{{tx.size()}}</span>
                <span>{{tx.fee}}</span>
                <span>
                    <div v-for="vin in tx.vin ">
                        <account-identicon :publicKey="vin.publicKey" size="20" outer-size="20" />
                        <span class="amount vertical-center">-{{convertToBase(vin.amount)}}</span>
                    </div>
                </span>
                <span>
                    <div v-for="vout in tx.vout">
                        <account-identicon :publicKeyHash="vout.publicKeyHash" size="20" outer-size="20" />
                        <span class="amount vertical-center">{{convertToBase(vout.amount)}}</span>
                    </div>
                </span>
            </div>
        </div>

    </div>

</template>

<script>
import AccountIdenticon from "src/components/wallet/account/account-identicon";
export default {

    components: {AccountIdenticon},

    props:{
        transactions: null,
    },

    methods:{
        convertToBase(amount){
            return global.apacache._scope.argv.transactions.coins.convertToBase(amount);
        }
    }

}
</script>

<style scoped>

    .table-row{
        grid-template-columns: 1fr 70px 120px 50px 70px 50px 100px 100px;
    }

    .identicon{
        display: inline;
    }

    .amount{
        display: inline-block;
    }

</style>