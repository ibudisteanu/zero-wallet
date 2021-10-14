<template>

    <layout>

        <layout-title icon="fa fa-piggy-bank" title="Private Delegate Funds">Delegate Funds Privately to Delegating Address</layout-title>

        <zether-tx ref="refZetherTx"
                   :titles-offset="{ 0.5: {icon: 'fas fa-edit', name: 'Delegation', tooltip: 'Delegation update' }}"
                   :init-available-assets="[PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX]"
                   :tx-data="txData" tx-name="createZetherDelegateStakingTx"
                   :public-key="publicKey" @onSetTab="setTab"
                   :use-burn="true" :skip-receiver-tab="true">

            <template :slot="`tab_${0.5}`">
                <destination-address text="Delegate Address" asset="" @changed="changedDelegateDestination"></destination-address>
                <delegated-staking-new-info :public-key="delegatePublicKey" @onChanges="delegatedStakingNewInfoChanges" />
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

export default {

    components: { ZetherTx,  LayoutTitle, Layout, DelegatedStakingNewInfo, DestinationAddress },

    data(){
        return {
            hasNewDelegatedInfo: false,
            delegatedStakingNewInfo: {},
            delegateDestination: {},
            delegatePublicKey: null,
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
        txData(){
            return {
                ...this.delegatedStakingNewInfo,
                delegateDestination: this.delegateDestination.addressEncoded
            }
        }
    },

    methods: {

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === 0.5 && value > oldTab){
                    if (this.delegateDestination.validationError) throw this.delegateDestination.validationError;
                    if (this.delegatedStakingNewInfo.validationDelegatedStakingNewPublicKey) throw this.delegatedStakingNewInfo.validationDelegatedStakingNewPublicKey
                }

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },

        changedDelegateDestination(data){
            this.delegateDestination = { ...this.delegateDestination,  ...data, }
            this.delegatePublicKey = (this.delegateDestination && this.delegateDestination.address) ? this.delegateDestination.address.publicKey : ""
        },

        delegatedStakingNewInfoChanges(data){
            this.delegatedStakingNewInfo = {
                ...this.delegatedStakingNewInfo,
                ...data
            }
        },


    },

    mounted(){
    },

}

</script>

<style scoped>
</style>
