<template>

    <div class="container">
        <div class="boxed centered pd-bottom-30">

            <template v-if="isLoading">
                <loading-spinner />
            </template>
            <template v-else-if="!isFound">
                <strong>Address does not exist</strong>
            </template>
            <template v-else>

                <template v-if="isEmpty">
                    <strong>No available balance</strong>
                </template>
                <template v-else>
                    <div>
                        <strong>Balances</strong>
                        <balance v-for="(balance, index) in balances"
                                 :key="`balance-token-${index}`"
                                 :balance="balance.amount"
                                 :token="balance.token"
                                 :version="account.version">
                        </balance>
                    </div>
                </template>

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
        publicKeyHash: {default: ""}
    },

    computed:{

        account(){
            return this.$store.state.addresses.accounts[this.publicKeyHash]
        },

        balances(){
            return this.account.balances;
        },

        delegatedStake(){
            return this.account.delegatedStake
        },

        delegatedStakesPending(){
            if (!this.delegatedStake) return []
            return this.delegatedStake.stakesPending
        },

        isLoading(){
            return this.account === undefined
        },

        isFound(){
            return this.account !== null
        },

        isEmpty(){
            return !this.account.balances.length
        }


    },


}
</script>

<style scoped>

    .container{
    }

    .boxed{

    }

</style>
