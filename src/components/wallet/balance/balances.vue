<template>

    <div class="container">
        <div class="boxed centered pd-bottom-30">

            <div v-if="isEmpty">
                <strong>Empty address</strong>
            </div>
            <div v-else>
                <balance v-for="(balance, index) in balances"
                         :key="`balance-token-${index}`"
                         :balance="balance.amount"
                         :token="balance.token"
                         :version="address.version">
                </balance>
            </div>

        </div>
    </div>

</template>

<script>
import LoadingSpinner from "src/components/utils/loading-spinner";
import Balance from "./balance.vue"
import AccountIdenticon from "../account/account-identicon";

export default {

    components: {AccountIdenticon, LoadingSpinner, Balance},

    props: {
        address: {default: null}
    },

    computed:{

        balances(){
            return this.address.account.balances;
        },

        isEmpty(){
            return this.address.account.balances.length === 0
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

</style>
