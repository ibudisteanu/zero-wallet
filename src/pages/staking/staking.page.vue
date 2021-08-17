<template>

    <layout>

        <layout-title icon="fa-piggy-bank" title="Staking">Delegate your stakes to a staking node.</layout-title>

        <div class="account-info" v-if="address">

            <account :address="address" />

            <div class="pt-4" v-if="!isLoading">

                <div class="card mb-3">
                    <div class="card-header bg-light">
                        <div class="row align-items-center">
                            <div class="col">
                                <h5 class="mb-0">Staking</h5>
                            </div>
                        </div>
                    </div>
                    <div class="card-body border-bottom border-200">

                        <span class="d-block">Available coins for Staking: <strong>{{balance}}</strong></span>
                        <span v-if="balance < minimumForStaking" class="text-danger d-block" >Minimum required for Staking {{minimumForStaking}}</span>

                        <template v-if="!isDelegated" >
                            <span class="d-block pt-4">Delegated: <strong>NO</strong> </span>
                        </template>
                        <template v-else>
                            <span class="d-block pt-4">Delegated: <strong>YES</strong> </span>
                            <span class="d-block">Delegated public key {{account.delegatedStake.delegatedPublicKeyHash}}</span>
                            <span class="d-block">Delegated fee {{delegateFeePercentage}} %</span>
                        </template>

                        <template v-if="delegatedStake">

                            <div class=" pt-4">
                                <span class="fw-bold fs-0">Delegated Stake</span>
                                <balance :key="`delegated-balance`"  :balance="delegatedStake.stakeAvailable"  token="" :version="0">
                                </balance>
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
                            <span>Your delegating transaction is in pending right now...</span>
                            <loading-spinner />
                        </div>
                        <div v-else >

                            <button class="btn btn-falcon-default rounded-pill me-1 mb-1" type="button" @click="handleShowDelegateStake" v-tooltip.bottom="'Delegate your stake'" >
                                <i class="fa fa-piggy-bank pointer" />
                            </button>

                        </div>

                    </div>
                </div>

                <delegate-stake-modal ref="refDelegateStakeModal" />
                <stop-delegate-stake-modal ref="refStopDelegateStakeModal" :address="address" />
                <delegate-stake-private-key-modal ref="refDelegateStakePrivateKeyModal" :address="address" />
                <delegate-stake-node-modal ref="refDelegateStakeNodeModal" :address="address"/>

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
import consts from 'consts/consts';
import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import Account from "src/components/wallet/account/account"
import LoadingSpinner from "src/components/utils/loading-spinner";

import DelegateStakeModal from "src/components/staking/delegate-stake.modal.vue"
import StopDelegateStakeModal from "src/components/staking/stop-delegate-stake.modal.vue"
import DelegateStakePrivateKeyModal from "src/components/staking/delegate-stake-private-key.modal.vue"
import DelegateStakeNodeModal from "src/components/staking/delegate-stake-node.modal.vue"
import StringHelper from "../../utils/string-helper";
import Balance from "src/components/wallet/balance/balance.vue"
import DelegatedStakePending from "src/components/wallet/balance/delegated-stake-pending"
import AlertBox from "src/components/utils/alert-box"

export default {

    components: {AccountIdenticon, Layout, Account, LoadingSpinner, DelegateStakeModal, StopDelegateStakeModal, DelegateStakePrivateKeyModal, DelegateStakeNodeModal, LayoutTitle, DelegatedStakePending, Balance, AlertBox},

    data() {
        return {
            showPublicKey: false,
            showPublicKeyHash: false,
            error: "",
        }
    },

    computed:{

        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKeyHash];
        },
        account(){
            return this.$store.state.accounts.list[this.$store.state.wallet.mainPublicKeyHash]
        },
        isLoading(){
            return this.account === undefined
        },
        isFound(){
            return this.account !== null
        },

        balance(){
            const balances = { "": { amount: 0 } }
            if (this.account)
                for (const balance of this.account.balances)
                    balances[balance.token] = { amount: balance.amount }

            const amount = balances[""].amount || 0;
            return StringHelper.formatMoney( PandoraPay.config.coins.convertToBase( amount.toString() ), PandoraPay.config.coins.DECIMAL_SEPARATOR)
        },

        delegatedStake(){
            if (!this.account) return null
            return this.account.delegatedStake
        },

        delegatedStakesPending(){
            if (!this.delegatedStake) return []
            return this.delegatedStake.stakesPending
        },

        minimumForStaking(){
            const minimum = PandoraPay.config.stake.getRequiredStake( this.$store.state.blockchain.end.toString() )
            return StringHelper.formatMoney( PandoraPay.config.coins.convertToBase( minimum ), PandoraPay.config.coins.DECIMAL_SEPARATOR )
        },

        isDelegated(){
            if (this.delegatedStake && this.account.delegatedStakeVersion === 1) return true;
            return false;
        },

        delegateFeePercentage(){
            return 0
            return this.address.delegate.delegateStakeFee / PandoraPay.argv.transactions.staking.delegateStakingFeePercentage * 100;
        },

        pendingTxs(){
            return this.address.pendingTxs;
        },

        pendingTransactions(){

            const txs = this.pendingTxs;

            const out = [];
            for (const key in txs)
                if (this.$store.state.transactions.txsByHash[txs[key]])
                    out.push( this.$store.state.transactions.txsByHash[txs[key]] );

            return out;
        },

        isDelegateStakeInPending(){

            const pendingTxs = this.pendingTransactions;

            for (let i=0; i < pendingTxs.length; i++)
                if (pendingTxs[i].scriptVersion === 1)
                    return true;

            return false;
        }

    },

    methods:{

        handleShowDelegateStake(){
            if (!this.balance)
                return this.$store.dispatch('addToast', {
                    type: 'warning',
                    title: `Can't delegate`,
                    text: `You can't delegate as your wallet is empty`,
                })
            return this.$refs.refDelegateStakeModal.showModal(  );
        },

        handleShowStopDelegateStake(){
            return this.$refs.refStopDelegateStakeModal.showModal( this.address.delegate );
        },

        handleShowDelegatePrivateKey(){
            return this.$refs.refDelegateStakePrivateKeyModal.showModal( this.address.delegate );
        },

        handleShowDelegateStakeNode(){
            return this.$refs.refDelegateStakeNodeModal.showModal( this.address.delegate );
        }

    },

    async mounted(){
        if (typeof window === "undefined") return;
    }

}
</script>

<style scoped>
</style>
