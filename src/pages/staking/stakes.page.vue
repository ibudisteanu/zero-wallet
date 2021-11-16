<template>

    <layout>

        <layout-title icon="fas fa-shopping-basket" title="Staking">Delegate your stakes to a staking node.</layout-title>

        <div class="account-info" v-if="address">

            <account :address="address" />

            <wait-account :account="account">
                <div class="card mb-3">
                    <div class="card-header bg-light">
                        <div class="row align-items-center">
                            <div class="col">
                                <h5 class="mb-0">Staking</h5>
                            </div>
                        </div>
                    </div>
                    <div class="card-body border-bottom border-200">

                        <template v-if="!isDelegated" >
                            <span class="d-block">Delegated: <strong>NO</strong> </span>
                        </template>
                        <template v-else>
                            <span class="d-block">Delegated: <strong>YES</strong> </span>
                            <span class="d-block">Delegated Stake Public Key {{account.plainAccount.delegatedStake.delegatedStakePublicKey}}</span>
                            <span class="d-block">Delegated Stake Fee {{delegateFeePercentage}} %</span>
                        </template>

                        <div class="pt-4" v-if="account && account.plainAccount">
                            <span class="fw-bold fs-0">Unclaimed</span>
                            <balance :key="`delegated-balance`"  :balance="account.plainAccount.unclaimed" />
                        </div>

                        <template v-if="delegatedStake">

                            <div class="pt-4">
                                <span class="fw-bold fs-0">Delegated Stake</span>
                                <balance :key="`delegated-balance`"  :balance="delegatedStake.stakeAvailable" />
                                <span v-if="delegatedStake.stakeAvailable < minimumForStaking" class="text-danger d-block"> Minimum balance required for Staking {{minimumForStaking}}</span>
                            </div>
                            <div class="pt-4" >
                                <span class="fw-bold fs-0">Delegated Stakes in pending {{!delegatedStakesPending.length ? 'None' : ''}}</span>
                                <delegated-stake-pending v-for="(delegatedStakePending, index) in delegatedStakesPending"
                                                         :key="`delegated-stake-pending-${index}`"
                                                         :delegatedStakePending="delegatedStakePending">
                                </delegated-stake-pending>
                            </div>

                        </template>

                    </div>

                </div>

            </wait-account>

        </div>

    </layout>

</template>

<script>
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import Account from "src/components/wallet/account/account"
import LoadingSpinner from "src/components/utils/loading-spinner";
import StringHelper from "../../utils/string-helper";
import Balance from "src/components/wallet/balance/balance"
import DelegatedStakePending from "src/components/wallet/balance/delegated-stake-pending"
import AlertBox from "src/components/utils/alert-box"
import WaitAccount from "../../components/wallet/account/wait-account";

export default {

    components: {
        WaitAccount, AccountIdenticon, Layout, Account, LoadingSpinner, LayoutTitle, DelegatedStakePending,
        Balance, AlertBox },

    data() {
        return {
            showPublicKey: false,
            error: "",
        }
    },

    computed:{

        publicKey(){
            return this.$store.state.wallet.mainPublicKey
        },
        address(){
            return this.$store.state.wallet.addresses[this.publicKey];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        delegatedStake(){
            if (!this.account || !this.account.plainAccount || this.account.plainAccount.version === 0) return null
            return this.account.plainAccount.delegatedStake
        },

        delegatedStakesPending(){
            return this.delegatedStake.stakesPending ? this.delegatedStake.stakesPending : []
        },

        isDelegated(){
            return (!!this.delegatedStake)
        },

        delegateFeePercentage(){
            if (!this.delegatedStake) return 0
            return this.delegatedStake.delegatedStakeFee / 65535 * 100;
        },

        pendingTxs(){
            return this.address.pendingTxs;
        },

        pendingTransactions(){
            return Object.keys( this.$store.state.accountsPendingTxs.list[this.publicKey] || {} )
        },

        isDelegateStakeInPending(){
            return this.pendingTransactions.length > 0;
        }

    },

    asyncComputed:{
        async minimumForStaking(){
            const minimum = await PandoraPay.config.stake.getRequiredStake( this.$store.state.blockchain.end.toString() )
            return StringHelper.formatMoney( await PandoraPay.config.coins.convertToBase( minimum ), PandoraPay.config.coins.DECIMAL_SEPARATOR )
        },
    },

    methods:{

    },

    async mounted(){
        if (typeof window === "undefined") return;
    }

}
</script>

<style scoped>
</style>
