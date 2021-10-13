<template>

    <layout>

        <layout-title icon="fa-piggy-bank" title="Staking">Delegate your stakes to a staking node.</layout-title>

        <div class="account-info" v-if="address">

            <account :address="address" />

            <alert-box v-if="!isLoading && !isFound" type="warning" >
                Address doesn't exist (is empty)!
            </alert-box>
            <div v-else-if="account" class="pt-4">

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

                        <div class="pt-4" v-if="account.plainAccount">
                            <span class="fw-bold fs-0">Claimable</span>
                            <balance :key="`delegated-balance`"  :balance="account.plainAccount.claimable" asset=""></balance>
                        </div>

                        <template v-if="delegatedStake">

                            <div class="pt-4">
                                <span class="fw-bold fs-0">Delegated Stake</span>
                                <balance :key="`delegated-balance`"  :balance="delegatedStake.stakeAvailable" asset=""></balance>
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

                    <div class="card-footer bg-light g-0 d-block-inline p-3">

                        <div v-if="isDelegateStakeInPending">
                            <span>You have a transaction in mempool...</span>
                            <loading-spinner />
                        </div>
                        <div v-else >

<!--                            <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer" type="button" @click="handleShowDelegateStake" v-tooltip.bottom="'Manual Delegating your stake'" >-->
<!--                                <i class="fa fa-link " />-->
<!--                            </button>-->

                            <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer" type="button" @click="handleShowUpdateDelegate" v-tooltip.bottom="'Update Delegated Stake'" :disabled="!isDelegated" >
                                <i class="fa fa-marker " />
                            </button>

                            <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer" type="button" @click="handleShowUpdateDelegateStakeNode" v-tooltip.bottom="'Update Delegated Stake to a Node'" :disabled="!isDelegated" >
                                <i class="fa fa-laptop-code " />
                            </button>

                            <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer" type="button" @click="handleShowUnstake" v-tooltip.bottom="'Unstaking'" :disabled="!isDelegated" >
                                <i class="fa fa-unlink text-danger " />
                            </button>

                        </div>

                    </div>
                </div>

                <unstake-modal ref="refUnstakeModal" />
                <update-delegate-modal ref="refUpdateDelegateModal" />
                <update-delegate-stake-node-modal ref="refUpdateDelegateStakeNodeModal" @onDelegateStake="onDelegateStake" />

            </div>

        </div>

        <div class="py-3 text-center" v-if="!address || isLoading">
            <loading-spinner class="fs-3" />
        </div>
        <alert-box v-if="error" type="error">{{error}}</alert-box>

    </layout>

</template>

<script>
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import Account from "src/components/wallet/account/account"
import LoadingSpinner from "src/components/utils/loading-spinner";
import UnstakeModal from "src/components/staking/unstake.modal"
import UpdateDelegateModal from "src/components/staking/update-delegate.modal"
import UpdateDelegateStakeNodeModal from "src/components/staking/update-delegate-stake-node.modal"
import StringHelper from "../../utils/string-helper";
import Balance from "src/components/wallet/balance/balance"
import DelegatedStakePending from "src/components/wallet/balance/delegated-stake-pending"
import AlertBox from "src/components/utils/alert-box"

export default {

    components: {AccountIdenticon, Layout, Account, LoadingSpinner, UnstakeModal,
        UpdateDelegateStakeNodeModal, LayoutTitle, DelegatedStakePending, Balance, AlertBox, UpdateDelegateModal},

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
        isLoading(){
            return this.account === undefined
        },
        isFound(){
            return this.account !== null
        },

        delegatedStake(){
            if (!this.account || !this.account.plainAccount) return null
            return this.account.plainAccount.delegatedStake
        },

        delegatedStakesPending(){
            if (!this.delegatedStake) return []
            return this.delegatedStake.stakesPending
        },

        isDelegated(){
            return (this.delegatedStake && this.account.plainAccount.delegatedStakeVersion === 1)
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

        handleShowUnstake(){
            return this.$refs.refUnstakeModal.showModal( this.publicKey );
        },

        handleShowUpdateDelegateStakeNode(){
            return this.$refs.refUpdateDelegateStakeNodeModal.showModal( this.publicKey );
        },

        handleShowUpdateDelegate(data){
            return this.$refs.refUpdateDelegateModal.showModal(this.publicKey, data)
        },

        onDelegateStake(data){
            return this.handleShowUpdateDelegate(data)
        },

    },

    async mounted(){
        if (typeof window === "undefined") return;
    }

}
</script>

<style scoped>
</style>
