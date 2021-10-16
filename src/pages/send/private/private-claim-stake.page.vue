<template>

    <layout>

        <layout-title icon="fa fa-search-dollar" title="Private Claim Stake">Claim funds from Claimable Stakes</layout-title>

        <zether-tx ref="refZetherTx"
                   :titles-offset="{ '-1': {icon: 'fas fa-coins', name: 'Claim', tooltip: 'Claim stakes' }}"
                   :init-available-asset="PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX"
                   tx-name="createZetherDelegateStakeTx" :public-key="publicKey" @onSetTab="setTab" @onBeforeProcess="handleBeforeProcess">

            <template :slot="`tab_${-1}`">
                <tx-amount :validate-amount="true" @changed="changedClaimAmount" :balances="balancesOnlyClaimable" :asset="''" />
            </template>

        </zether-tx>

    </layout>
</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title";
import ZetherTx from "src/components/send/txs/zether-tx";
import DelegatedStakingNewInfo from "src/components/staking/delegated-staking-new-info"
import DestinationAddress from "src/components/send/destination-address";
import TxAmount from "src/components/send/tx-amount"

export default {

    components: { ZetherTx,  LayoutTitle, Layout, DelegatedStakingNewInfo, DestinationAddress, TxAmount },

    data(){
        return {
            claimAmount: {}
        }
    },

    props: {
    },

    computed: {
        PandoraPay() {
            return PandoraPay
        },
        publicKey(){
            return this.$store.state.wallet.mainPublicKey
        },
        address(){
            return this.$store.state.wallet.addresses[this.publicKey];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        balancesOnlyClaimable(){
            return (this.account && this.account.plainAccount ) ? { "": { amount: this.account.plainAccount.claimable, asset: "" } } : { "": { amount: 0, asset: ""} }
        },
        getAsset() {
            return this.$store.getters.getAsset(PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX);
        },
    },

    methods: {

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === -1 && value > oldTab){
                    if (this.claimAmount.validationError) throw this.claimAmount.validationError;
                }

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },

        changedClaimAmount(data){
            this.claimAmount = {...this.claimAmount, ...data}
        },

        async handleBeforeProcess({resolve, reject, password, data }){

            try{


                resolve( true )

            }catch(err){
                reject(err)
            }

        }

    },

    mounted(){
    },

}

</script>

<style scoped>
</style>
