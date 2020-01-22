<template>

    <div>

        <div class="table">
            <div class="table-header table-row">
                <span>Hash</span>
                <span>V</span>
                <span>Script</span>
                <span>Nonce</span>
                <span>Token</span>
                <span>Queued</span>
                <span>In</span>
                <span>Out</span>
            </div>
            <div v-for="(tx, txId) in transactionsInfo" class="table-row">

                <span><router-link :to="`/explorer/tx/hash/${txId}`">{{txId.substr(0,20)+'...'}}</router-link></span>
                <span>{{tx.version}}</span>
                <span>{{tx.scriptVersion}}</span>
                <span>{{tx.nonce}}</span>
                <span>{{tx.tokenCurrency.toString("hex")}}</span>
                <span>{{tx.queued}}</span>
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
import Consensus from "src/consensus/consensus"

export default {

    components: {AccountIdenticon},

    props:{
        transactionsInfo: null,
    },

    methods:{

        convertToBase(amount){
            return global.apacache._scope.argv.transactions.coins.convertToBase(amount);
        },



    }

}
</script>

<style scoped>

    .table-row{
        grid-template-columns: 1fr 30px 40px 60px 100px 70px 150px 150px;
    }

    .identicon{
        display: inline;
    }

    .amount{
        display: inline-block;
    }

</style>