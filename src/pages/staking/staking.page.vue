<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Staking</h1>
                <span>In browser, you can only delegate your stakes</span>

                TODO

                <div class="account-info" v-if="address">

                    <account :account="address" />

                    <loading-spinner v-if="!address.loaded" />

                    <div class="pd-top-40" v-else>

                        <span>Available coins for Staking <strong>{{balance}}</strong></span>
                        <span v-if="balance < minimumForStaking" class="danger">Minimum required for Staking {{minimumForStaking}}</span>

                        <div class="pd-bottom-20"></div>

                        <span>Delegated: <strong>{{isDelegated}}</strong> </span>

                        <div v-if="isDelegateStakeInPending">
                            <span>Your delegating transaction is in pending right now...</span>
                            <loading-spinner />
                        </div>
                        <div v-else >

                            <div v-if="address.delegate" >
                                <span>Delegated nonce {{address.delegate.delegateStakeNonce}}</span>
                                <span>Delegated public key {{address.delegate.delegateStakePublicKey}}</span>
                                <span>Delegated fee {{delegateFeePercentage}} %</span>
                            </div>

                            <div class="buttons-row pd-top-20">

                                <div class="btn">
                                    <div class="btn-round pointer" @click="handleShowDelegateStake" v-tooltip.bottom="'Delegate your stake'" :disabled="!balance" >
                                        <i class="fa fa-link" :disabled="!balance"  />
                                    </div>
                                </div>

                                <div class="btn">
                                    <div class="btn-round pointer" @click="handleShowStopDelegateStake" v-tooltip.bottom="'Stop delegating your stake'" :disabled="!isDelegated || !balance" >
                                        <i class="fa fa-unlink danger" :disabled="!isDelegated || !balance" />
                                    </div>
                                </div>

                                <div class="btn">
                                    <div class="btn-round pointer" @click="handleShowDelegatePrivateKey" v-tooltip.bottom="'View Delegate Stake private key'" :disabled="!balance">
                                        <i class="fa fa-eye" :disabled="!balance" />
                                    </div>
                                </div>

                                <div class="btn">
                                    <div class="btn-round pointer" @click="handleShowDelegateStakeNode" v-tooltip.bottom="'Delegate Stake to node'" :disabled="!balance" >
                                        <i class="fa fa-laptop-code" :disabled="!balance" ></i>
                                    </div>
                                </div>

                            </div>


                        </div>

                        <delegate-stake-modal ref="refDelegateStakeModal" :address="address" />
                        <stop-delegate-stake-modal ref="refStopDelegateStakeModal" :address="address" />
                        <delegate-stake-private-key-modal ref="refDelegateStakePrivateKeyModal" :address="address" />
                        <delegate-stake-node-modal ref="refDelegateStakeNodeModal" :address="address"/>

                    </div>

                </div>
            </div>
        </div>
    </layout>

</template>

<script>
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import consts from 'consts/consts';
import Layout from "src/components/layout/layout"
import Account from "src/components/wallet/account/account"
import LoadingSpinner from "src/components/utils/loading-spinner";
import Consensus from "src/consensus/consensus"

import DelegateStakeModal from "src/components/staking/delegate-stake.modal.vue"
import StopDelegateStakeModal from "src/components/staking/stop-delegate-stake.modal.vue"
import DelegateStakePrivateKeyModal from "src/components/staking/delegate-stake-private-key.modal.vue"
import DelegateStakeNodeModal from "src/components/staking/delegate-stake-node.modal.vue"

export default {

    components: {AccountIdenticon, Layout, Account, LoadingSpinner, DelegateStakeModal, StopDelegateStakeModal, DelegateStakePrivateKeyModal, DelegateStakeNodeModal},

    data() {
        return {
            showPublicKey: false,
            showPublicKeyHash: false,
        }
    },

    computed:{

        address(){
            return this.$store.state.addresses.list[this.$store.state.wallet.mainPublicKeyHash] ;
        },

        balance(){
            const balances = this.address.balances || {"": {amount: 0}};
            const amount = balances[""].amount || 0;
            return PandoraPay.argv.transactions.coins.convertToBase( amount );
        },

        minimumForStaking(){
            return PandoraPay.argv.transactions.coins.convertToBase( PandoraPay.argv.transactions.staking.getMinimumStakeRequiredForForging( this.$store.state.blockchain.end ) );
        },

        isDelegated(){
            if (this.address.delegate && this.address.delegateVersion === 1) return true;
            return false;
        },

        delegateFeePercentage(){
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
            return this.$refs.refDelegateStakeModal.showModal( this.address.delegate );
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

    .buttons-row .btn{
        display: inline-block;
    }

    .btn-round{
        font-size: 20px;
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
        margin-right: 30px;
    }

    .btn-round i{
        margin-top: 10px;
    }

</style>
