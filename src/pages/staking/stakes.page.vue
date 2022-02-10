<template>

    <layout>

        <layout-title icon="fas fa-shopping-basket" title="Staking">Delegate your stakes to a staking node.</layout-title>

        <div class="account-info" v-if="walletAddress">

            <account :address="walletAddress" />

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
                                <span v-if="delegatedStake.stakeAvailable.lt( minimumForStaking )" class="text-danger d-block"> Minimum balance required for Staking {{minimumForStaking}}</span>
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
import StringHelper from "src/utils/string-helper";
import Balance from "src/components/wallet/balance/balance"
import DelegatedStakePending from "src/components/wallet/balance/delegated-stake-pending"
import AlertBox from "src/components/utils/alert-box"
import WaitAccount from "src/components/wallet/account/wait-account";
import Decimal from 'decimal.js';

export default {

    components: {
        WaitAccount, AccountIdenticon, Layout, Account, LoadingSpinner, LayoutTitle, DelegatedStakePending,
        Balance, AlertBox },

    data() {
        return {
            showPublicKey: false,
            minimumForStaking: new Decimal(0),
            minimumForStakingText: "",
            error: "",
        }
    },

    computed:{

        publicKey(){
            return this.$store.state.wallet.mainPublicKey
        },
        walletAddress(){
            return this.$store.state.wallet.addresses[this.publicKey];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        delegatedStake(){
            if (!this.account || !this.account.plainAccount || this.account.plainAccount.delegatedStake.version.eq(0) ) return null
            return this.account.plainAccount.delegatedStake
        },

        delegatedStakesPending(){
            return this.delegatedStake.stakesPending ? this.delegatedStake.stakesPending : []
        },

        isDelegated(){
            return (!!this.delegatedStake)
        },

        delegateFeePercentage(){
            if (!this.delegatedStake || !this.delegatedStake.delegatedStakeFee) return new Decimal(0)
            return this.delegatedStake.delegatedStakeFee.mul(100).div( PandoraPay.config.stake.DELEGATING_STAKING_FEE_MAX_VALUE  );
        },

        pendingTransactions(){
            return Object.keys( this.$store.state.accountsPendingTxs.list[this.publicKey] || {} )
        },

        isDelegateStakeInPending(){
            return this.pendingTransactions.length > 0;
        }

    },

    asyncComputed:{

    },

    methods:{

    },

    async mounted(){
        if (typeof window === "undefined") return;

        const minimum = await PandoraPay.config.stake.getRequiredStake( this.$store.state.blockchain.end.toString() )
        this.minimumForStaking = new Decimal(minimum).div( new Decimal(10).pow( PandoraPay.config.coins.DECIMAL_SEPARATOR ) )
        this.minimumForStakingText = StringHelper.formatMoney( this.minimumForStaking, PandoraPay.config.coins.DECIMAL_SEPARATOR )
    }

}
</script>

<style scoped>
</style>
