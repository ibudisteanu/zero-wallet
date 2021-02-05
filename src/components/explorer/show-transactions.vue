<template>

    <div>
        <div class="row pd-top-10 pd-bottom-10">
            <span class="col-xs-6 col-sm-3 wordwrap">Hash</span>
            <span class="col-xs-6 col-sm-1 wordwrap">Time</span>
            <span class="col-xs-12 col-sm-8 wordwrap">Data</span>
        </div>
        <div v-for="(tx, key) in transactions"
             :class="`row pd-top-10 pd-bottom-10 ${isPending(tx) ? 'grid-primary' : ''} `"
             :key="`show-transaction-${key}`">

            <router-link :to="`/explorer/tx/hash/${tx.hash().toString('hex')}`">

                <span class="col-xs-6 col-sm-3 wordwrap"><router-link :to="`/explorer/tx/hash/${tx.hash().toString('hex')}`">{{tx.hash().toString("hex").substr(0,10)+'...'}}</router-link></span>
                <span class="col-xs-6 col-sm-1 wordwrap">
                    <template v-if="!isPending(tx)">
                        {{ timeAgo( $store.state.blockchain.genesisTimestamp +  tx.__extra.timestamp) }}
                    </template>
                    <template v-else>
                        pending
                    </template>
                </span>
                <span class="col-xs-12 col-sm-8 wordwrap">
                    <div class="input" v-for="(vin, index) in tx.vin "
                        :key="`show-transaction-vin-${index}`">
                        <account-identicon :publicKey="vin.publicKey" size="20" outer-size="7" />
                        <span class="amount vertical-center">{{$store.getters.addressesContains(tx) ? convertToBase(-vin.amount) : '?'}} {{vin.tokenCurrency.toString("hex")}} </span>
                    </div>
                    <div class="output" v-for="(vout, index) in tx.vout"
                         :key="`show-transaction-vout-${index}`">
                        <account-identicon :publicKeyHash="vout.publicKeyHash" size="20" outer-size="7" />
                        <span class="amount vertical-center">{{$store.getters.addressesContains(tx) ? convertToBase(vout.amount) : '?'}} {{vout.tokenCurrency.toString("hex")}}</span>
                    </div>
                </span>
            </router-link>

        </div>

    </div>

</template>

<script>
import AccountIdenticon from "src/components/wallet/account/account-identicon";

export default {

    components: {AccountIdenticon},

    props:{
        transactions: {default: null},
    },

    methods:{

        timeAgo(timestamp){
            return kernel.helpers.StringHelper.timeSince( timestamp*1000, false );
        },

        convertToBase(amount){
            return PandoraPay.argv.transactions.coins.convertToBase(amount);
        },

        isPending(tx){
            return tx.__extra.height ? false : true
        }

    }

}
</script>

<style scoped>

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

</style>