<template>

    <div class="container">
        <div class="boxed centered pd-top-30 pd-bottom-30">

            <div v-if="isEmpty" class="pd-top-20">
                <strong>Empty address</strong>
            </div>
            <div v-else>
                <balance v-for="(balance, token) in balances"
                         :key="`balance-token-${token}`"
                         :balance="balance"
                         :type="address.version">
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

</style>
