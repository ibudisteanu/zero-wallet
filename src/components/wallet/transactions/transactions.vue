<template>

    <div class="container">

        <div class="boxed boxed-background">

            <span class="title">Transactions</span>

            <div>

                <transaction v-for=" (tx, index) in txs "
                             :key="index"
                             :tx="tx">

                </transaction>

            </div>

        </div>

    </div>

</template>

<script>

import Transaction from "./transaction"

export default {

    components: {Transaction},

    props: {
        address: null
    },

    data(){
        return {
            txs: [ {
                    txId: '111111111111111',
                    timestamp: new Date().getTime()-500000,
                    amount: undefined,
                    whisper: 10,
                    currency: 'USD',

                    from: undefined,
                    to: undefined,
                },

                {
                    txId: '2222222222222222',
                    timestamp: new Date().getTime()-1000,
                    amount: 20,
                    whisper: undefined,
                    currency: 'EUR',

                    from: undefined,
                    to: undefined,
                },

            ],
        }
    }

}
</script>

<style scoped>

    .container{

    }

    .title{
        font-size: 20px;
    }

</style>