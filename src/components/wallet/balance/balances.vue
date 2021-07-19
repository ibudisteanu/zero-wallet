<template>

    <div class="card mb-3  overflow-hidden">
        <div class="card-header bg-light">
            <div class="row align-items-center">
                <div class="col">
                    <h5 class="mb-0">
                        Balances
                        <template v-if="isLoading">
                            <loading-spinner />
                        </template>
                    </h5>
                </div>
            </div>
        </div>
        <div class="card-body p-0" v-if="!isLoading && isFound">
            <div class="row g-0 align-items-center py-2 position-relative border-bottom border-200 text-center">
                <h5 class="fw-bold fs-0 pt-4">All holdings</h5>
                <balance v-for="(balance, index) in balances"
                         :key="`balance-token-${index}`"
                         :balance="balance.amount"
                         :token="balance.token"
                         :version="account.version">
                </balance>
                <div v-if="delegatedStake">
                    <h5 class="fw-bold fs-0 pt-4">Delegated Stake</h5>
                    <balance :key="`delegated-balance`"
                            :balance="delegatedStake.stakeAvailable"
                            token=""
                            :version="0">
                    </balance>
                </div>
                <div v-if="delegatedStakesPending.length" >
                    <h5 class="fw-bold fs-0 pt-4">Delegated Stakes in pending</h5>
                    <delegated-stake-pending v-for="(delegatedStakePending, index) in delegatedStakesPending"
                                   :key="`delegated-stake-pending-${index}`"
                                   :delegatedStakePending="delegatedStakePending">
                    </delegated-stake-pending>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import LoadingSpinner from "src/components/utils/loading-spinner";
import Balance from "./balance.vue"
import AccountIdenticon from "../account/account-identicon";
import DelegatedStakePending from "./delegated-stake-pending"

export default {

    components: {AccountIdenticon, LoadingSpinner, Balance, DelegatedStakePending},

    props: {
        publicKeyHash: {default: ""}
    },

    computed:{

        account(){
            return this.$store.state.accounts.list[this.publicKeyHash]
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
</style>
