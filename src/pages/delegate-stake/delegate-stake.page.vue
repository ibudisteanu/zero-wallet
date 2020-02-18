<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Delegate Stake</h1>

                <div class="account-info">

                    <account :identicon="address.identicon" :name="address.name" :address="address.address" />

                    <loading-spinner v-if="!address.loaded" />

                    <div v-else>

                        <span>Available coins for Staking <strong>{{balance}}</strong></span> <br/>
                        <span v-if="balance < minimumForStaking" class="danger">Minimum required for Staking {{minimumForStaking}}</span> <br/>

                        <div class="pd-bottom-20"></div>

                        <span>Delegated: <strong>{{isDelegated}}</strong> </span> <br/>
                        <span>Delegated nonce {{address.delegate.delegateNonce}}</span> <br/>
                        <span>Delegated public key {{address.delegate.delegatePublicKey}}</span> <br/>
                        <span>Delegated fee {{delegateFeePercentage}} %</span> <br/>

                        <div class="buttons-row pd-top-20">

                            <div class="btn">
                                <div class="btn-round" @click="delegateStake" v-tooltip.bottom="'Delegate your stake'" >
                                    <i class="fa fa-link"></i>
                                </div>
                            </div>

                            <div class="btn">
                                <div class="btn-round" @click="stopDelegateStake" v-tooltip.bottom="'Stop delegating your stake'" >
                                    <i class="danger fa fa-unlink"></i>
                                </div>
                            </div>

                            <div class="btn">
                                <div class="btn-round" @click="showDelegatePrivateKey" v-tooltip.bottom="'View Private Key of the delegation'" >
                                    <i class="fa fa-eye"></i>
                                </div>
                            </div>

                        </div>

                        <delegate-stake-modal ref="refDelegateStakeModal" />
                        <stop-delegate-stake-modal ref="refStopDelegateStakeModal" />

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

import DelegateStakeModal from "src/components/wallet/delegate-stake/delegate-stake.modal.vue"
import StopDelegateStakeModal from "src/components/wallet/delegate-stake/stop-delegate-stake.modal.vue"

export default {

    components: {AccountIdenticon, Layout, Account, LoadingSpinner, DelegateStakeModal, StopDelegateStakeModal},

    data() {
        return {
            showPublicKey: false,
            showPublicKeyHash: false,
        }
    },

    computed:{

        address(){
            return this.$store.state.addresses.list[this.$store.state.wallet.mainAddress] ;
        },

        balance(){
            const balances = this.address.balances || {"00": 0};
            console.log(balances["00"]||0);
            return PandoraPay._scope.argv.transactions.coins.convertToBase( balances["00"]||0 );
        },

        minimumForStaking(){
            return PandoraPay._scope.argv.transactions.staking.stakingMinimumStake;
        },

        isDelegated(){
            return this.address.delegate.delegatePublicKey !== "00";
        },

        delegateFeePercentage(){
            return this.address.delegate.delegateFee / PandoraPay._scope.argv.transactions.staking.delegateStakingFeePercentage;
        }

    },

    methods:{

        delegateStake(){
            return this.$refs.refDelegateStakeModal.showModal();
        },

        stopDelegateStake(){
            return this.$refs.refStopDelegateStakeModal.showModal();
        },

        showDelegatePrivateKey(){

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