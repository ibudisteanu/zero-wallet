<template>

    <div class="container">
        <div class="boxed centered pd-top-30 pd-bottom-30">

            <span class="title">Account Balance</span>

            <div v-if="address">

                <loading-spinner v-if="!address.loaded" />

                <div v-else>

                    <div v-if="isEmpty" class="pd-top-20">
                        <strong>Empty address</strong>
                    </div>
                    <div v-else>
                        <balance v-for="(balance, token) in balances"
                                 :key="`balance-token-${token}`"
                                 :balance="balance"
                                 :type="address.type">
                        </balance>
                    </div>

                </div>


            </div>

        </div>
    </div>

</template>

<script>
import LoadingSpinner from "src/components/utils/loading-spinner";
import Balance from "./balance.vue"

export default {

    components: {LoadingSpinner, Balance},

    props: {
        address: {default: null}
    },

    computed:{

        balances(){
            return this.address.balances;
        },

        isEmpty(){
            for (const key in this.address.balances)
                return false;
            return true;
        }

    },

    methods:{

    }

}
</script>

<style scoped>

    .container{
    }

    .boxed{

    }

    .title{
        font-size: 20px;
    }

</style>