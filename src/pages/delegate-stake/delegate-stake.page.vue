<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Delegate Stake</h1>

                <div class="account-info" v-if="address">

                    <account :identicon="address.identicon" :name="address.name" :address="address.address" />

                    <loading-spinner v-if="!address.loaded" />

                    <div v-else>

                        <span>Available coins for Staking <strong>{{balance}}</strong></span> <br/>
                        <span v-if="balance < minimumForStaking" class="danger">Minimum required for Staking {{minimumForStaking}}</span> <br/>

                        <div class="pd-bottom-20"></div>

                        <span>Delegated: <strong>{{isDelegated}}</strong> </span> <br/>

                        <div v-if="address.delegate">
                            <span>Delegated nonce {{address.delegate.delegateNonce}}</span> <br/>
                            <span>Delegated public key {{address.delegate.delegatePublicKey}}</span> <br/>
                            <span>Delegated fee {{delegateFeePercentage}} %</span> <br/>
                        </div>

                        <div class="buttons-row pd-top-20">

                            <div class="btn">
                                <div class="btn-round" @click="handleShowDelegateStake" v-tooltip.bottom="'Delegate your stake'" >
                                    <i class="fa fa-link"></i>
                                </div>
                            </div>

                            <div class="btn">
                                <div class="btn-round" @click="handleShowStopDelegateStake" v-tooltip.bottom="'Stop delegating your stake'" >
                                    <i class="danger fa fa-unlink"></i>
                                </div>
                            </div>

                            <div class="btn">
                                <div class="btn-round" @click="handleShowDelegatePrivateKey" v-tooltip.bottom="'View Private Key of the delegation'" >
                                    <i class="fa fa-eye"></i>
                                </div>
                            </div>

                        </div>

                        <delegate-stake-modal ref="refDelegateStakeModal" :address="address" :delegate="address.delegate" />
                        <stop-delegate-stake-modal ref="refStopDelegateStakeModal" :address="address" :delegate="address.delegate" />

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
            return PandoraPay.argv.transactions.coins.convertToBase( balances["00"]||0 );
        },

        minimumForStaking(){
            return PandoraPay.argv.transactions.staking.stakingMinimumStake;
        },

        isDelegated(){
            return this.address.delegate ? this.address.delegate.delegatePublicKey !== "00" : false;
        },

        delegateFeePercentage(){
            return this.address.delegate.delegateFee / PandoraPay.argv.transactions.staking.delegateStakingFeePercentage;
        }

    },

    methods:{

        handleShowDelegateStake(){
            return this.$refs.refDelegateStakeModal.showModal(  );
        },

        handleShowStopDelegateStake(){
            return this.$refs.refStopDelegateStakeModal.showModal();
        },

        handleShowDelegatePrivateKey(){

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