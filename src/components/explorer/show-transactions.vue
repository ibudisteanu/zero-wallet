<template>

    <div>

        <div class="table">
            <div class="table-header table-row">
                <span class="hide-mobile">Hash</span>
                <span>Time</span>
                <span>Data</span>
                <span>Token</span>
            </div>
            <router-link v-for="tx in transactions" :class="`table-row  ${isPending(tx) ? 'pending-row' : ''} `" :to="`/explorer/tx/hash/${tx.hash().toString('hex')}`">

                <span class="hide-mobile"><router-link :to="`/explorer/tx/hash/${tx.hash().toString('hex')}`">{{tx.hash().toString("hex").substr(0,10)+'...'}}</router-link></span>
                <span>
                    <template v-if="!isPending(tx)">
                        {{ timeAgo( $store.state.blockchain.genesisTimestamp +  tx.__extra.timestamp) }}
                    </template>
                    <template v-else>
                        pending
                    </template>
                </span>
                <span>
                    <div class="input" v-for="vin in tx.vin ">
                        <account-identicon :publicKey="vin.publicKey" size="20" outer-size="7" />
                        <span class="amount vertical-center">{{$store.getters.addressesContains(tx) ? convertToBase(-vin.amount) : '?'}}</span>
                    </div>
                    <div class="output" v-for="vout in tx.vout">
                        <account-identicon :publicKeyHash="vout.publicKeyHash" size="20" outer-size="7" />
                        <span class="amount vertical-center">{{$store.getters.addressesContains(tx) ? convertToBase(vout.amount) : '?'}}</span>
                    </div>
                </span>
                <span>
                    {{tx.tokenCurrency.toString("hex")}}
                </span>
            </router-link>
        </div>

    </div>

</template>

<script>
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import Utils from "src/utils/utils"

export default {

    components: {AccountIdenticon},

    props:{
        transactions: null,
    },

    methods:{

        timeAgo(timestamp){
            return Utils.timeSince( timestamp*1000, false );
        },

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
        grid-template-columns: 100px 70px 1fr 50px;
    }

    .identicon{
    }

    .amount{
        display: inline-block;
    }

    .input, .output{
        display: inline-block;
    }

    .amount {
    }


    @media (max-width: 481px) {
        .table-row{
            grid-template-columns: 70px 1fr ;
        }
    }

</style>