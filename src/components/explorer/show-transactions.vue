<template>

    <div>

        <div class="table">
            <div class="table-header table-row">
                <span>Hash</span>
                <span>Block</span>
                <span>Confirm</span>
                <span>Time</span>
                <span>Size</span>
                <span>Fee</span>
                <span>In</span>
                <span>Out</span>
            </div>
            <div v-for="tx in transactions" :class="`table-row  ${isPending(tx) ? 'pending-row' : ''} `">

                <span><router-link :to="`/explorer/tx/hash/${tx.hash().toString('hex')}`">{{tx.hash().toString("hex").substr(0,20)+'...'}}</router-link></span>
                <span>
                    <template v-if="!isPending(tx)">
                        <router-link :to="`/explorer/block/height/${tx.__extra.height}`">{{tx.__extra.height}}</router-link>
                    </template>
                </span>
                <span>
                    <template v-if="!isPending(tx)">
                        {{ $store.state.blockchain.end - tx.__extra.height -1 }}
                    </template>
                </span>
                <span>
                    <template v-if="!isPending(tx)">
                        {{tx.__extra.timestamp}}
                    </template>
                </span>
                <span>{{tx.size()}}</span>
                <span>{{tx.fee}}</span>
                <span>
                    <div class="input" v-for="vin in tx.vin ">
                        <account-identicon :publicKey="vin.publicKey" size="20" outer-size="7" />
                        <span class="amount vertical-center">-{{convertToBase(vin.amount)}}</span>
                    </div>
                </span>
                <span>
                    <div class="output" v-for="vout in tx.vout">
                        <account-identicon :publicKeyHash="vout.publicKeyHash" size="20" outer-size="7" />
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
        },

        isPending(tx){
            return tx.__extra.height ? false : true
        }

    }

}
</script>

<style scoped>

    .table-row{
        grid-template-columns: 1fr 65px 59px 50px 70px 50px 110px 110px;
    }

    .identicon{
    }

    .amount{
        display: inline-block;
    }

    .input, .output{
        display: grid;
        grid-template-columns: 34px 1fr;
    }

    .amount {
        padding-top: 10px;
    }

</style>