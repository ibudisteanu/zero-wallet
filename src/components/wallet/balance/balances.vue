<template>

    <div class="container">
        <div class="boxed centered pd-bottom-30">

            <template v-if="isEmpty">
                <strong>Empty address</strong>
            </template>
            <template v-if="!isEmpty">

                <div>
                    <strong>Balances</strong>
                    <balance v-for="(balance, index) in balances"
                             :key="`balance-token-${index}`"
                             :balance="balance.amount"
                             :token="balance.token"
                             :version="address.version">
                    </balance>
                </div>
                <div v-if="delegatedStake" class="pd-top-30">
                    <strong>Delegated Stake</strong>
                    <balance
                             :key="`delegated-balance`"
                             :balance="delegatedStake.stakeAvailable"
                             token=""
                             :version="0">
                    </balance>
                </div>
                <div v-if="delegatedStakesPending.length" class="pd-top-30">
                    <strong>Delegated Stake Pending</strong>
                    <stake-pending v-for="(stakePending, index) in delegatedStakesPending"
                            :key="`delegated-stake-pending-${index}`"
                            :stakePending="stakePending">
                    </stake-pending>
                </div>
            </template>

        </div>
    </div>

</template>

<script>
import LoadingSpinner from "src/components/utils/loading-spinner";
import Balance from "./balance.vue"
import AccountIdenticon from "../account/account-identicon";
import StakePending from "./stake-pending"

export default {

    components: {AccountIdenticon, LoadingSpinner, Balance, StakePending},

    props: {
        address: {default: null}
    },

    computed:{

        balances(){
            return this.address.account.balances;
        },

        delegatedStake(){
            return this.address.account.delegatedStake
        },

        delegatedStakesPending(){
            if (!this.delegatedStake) return []
            return this.delegatedStake.stakesPending
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
