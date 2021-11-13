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

                <h5 class="text-800 fs-0 pt-4">All private holdings</h5>
                <h4 v-if="!account.accounts || !account.accounts.length" class="fs-0 pt-1">Empty!</h4>
                <balance v-else v-for="(accountBalance, index) in account.accounts"
                         :key="`balance-asset-${index}`"
                         :balance="accountBalance.balance"
                         :asset="account.assets[index]"
                         :can-be-decoded="$store.getters.walletContains(publicKey)"
                         :public-key="publicKey"
                         version="zether">
                </balance>

                <template v-if="account.plainAccount">

                    <h5 class="text-800 fs-0 pt-4">Unclaimed</h5>
                    <balance :key="`delegated-balance`"
                             :balance="account.plainAccount.unclaimed"
                             version="transparent">
                    </balance>

                    <div v-if="delegatedStake">
                        <h5 class="text-800 fs-0 pt-4">Delegated Stake</h5>
                        <balance :key="`delegated-balance`"
                                 :balance="delegatedStake.stakeAvailable"
                                 version="transparent">
                        </balance>

                        <div v-if="delegatedStakesPending.length" >
                            <h5 class="text-800 fs-0 pt-4">Delegated Stakes in pending</h5>
                            <delegated-stake-pending v-for="(delegatedStakePending, index) in delegatedStakesPending"
                                                     :key="`delegated-stake-pending-${index}`"
                                                     :delegatedStakePending="delegatedStakePending">
                            </delegated-stake-pending>
                        </div>
                    </div>

                </template>

            </div>
        </div>
    </div>

</template>

<script>
import LoadingSpinner from "src/components/utils/loading-spinner";
import Balance from "./balance"
import AccountIdenticon from "../account/account-identicon";
import DelegatedStakePending from "./delegated-stake-pending"

export default {

    components: {AccountIdenticon, LoadingSpinner, Balance, DelegatedStakePending},

    props: {
        publicKey: {default: ""}
    },

    computed:{

        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },

        delegatedStake(){
            return this.account.plainAccount ? this.account.plainAccount.delegatedStake : null
        },

        delegatedStakesPending(){
            return this.delegatedStake.stakesPending ? this.delegatedStake.stakesPending : []
        },

        isLoading(){
            return this.account === undefined
        },

        isFound(){
            return this.account !== null
        },

        isEmpty(){
            return !this.account.accounts.length
        }

    },


}
</script>

<style scoped>
</style>
