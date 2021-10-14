<template>

    <layout>
        <layout-title icon="fa fa-marker" title="Update Delegate Info">Change Delegation Information</layout-title>

        <simple-tx :titles-offset="{ '-1': {icon: 'fa fa-edit', name: 'Update Delegation', tooltip: 'Change delegation info' } }"
                   :tx-data="txData" @onSetTab="setTab" :buttons-offset="buttons" :public-key="publicKey"
                   tx-name="createUpdateDelegateTx_Float">

            <template slot="tab_-1">

                <div class="form pb-2">
                    <tx-amount :validate-amount="true" :allow-zero="true" :balances="balancesOnlyClaimable" @changed="delegatedStakingUpdateAmountChanged" text="Update Staking Amount" asset="" tooltip="Convert claimable amount to staking amount." />
                </div>

                <delegated-staking-new-info :public-key="publicKey" @onChanges="delegatedStakingNewInfoChanges" />

            </template>

        </simple-tx>

    </layout>

</template>

<script>
import TxAmount from "src/components/send/tx-amount"
import SimpleTx from "src/components/send/txs/simple-tx"
import LoadingButton from "src/components/utils/loading-button";
import Layout from "src/components/layout/layout";
import LayoutTitle from "src/components/layout/layout-title";
import DelegatedStakingNewInfo from "src/components/staking/delegated-staking-new-info"

export default {

    components: {LayoutTitle, Layout, LoadingButton, SimpleTx, TxAmount, DelegatedStakingNewInfo },

    data(){
        return {
            delegatedStakingUpdateAmount: {},
            delegatedStakingNewInfo: {},
        }
    },

    computed:{
        publicKey(){
            return this.$store.state.wallet.mainPublicKey
        },
        address(){
            return this.$store.state.wallet.addresses[this.publicKey]
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        balancesOnlyClaimable(){
            return (this.account && this.account.plainAccount ) ? { "": { amount: this.account.plainAccount.claimable, asset: "" } } : { "": { amount: 0, asset: ""} }
        },
        buttons(){
            return { 1: { icon: 'fa fa-marker', text: 'Update delegate' }}
        },
        txData(){
            return {
                ...this.delegatedStakingNewInfo,
                delegatedStakingUpdateAmount: this.delegatedStakingUpdateAmount.amount,
            }
        }
    },

    methods:{

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === -1 && value > oldTab){
                    if (this.delegatedStakingUpdateAmount.validationError) throw this.delegatedStakingUpdateAmount.validationError
                    if (this.delegatedStakingNewInfo.validationDelegatedStakingNewPublicKey) throw this.delegatedStakingNewInfo.validationDelegatedStakingNewPublicKey

                    if (this.delegatedStakingUpdateAmount.amount === 0 && !this.hasNewDelegatedInfo) throw "You should update something."
                }

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },

        delegatedStakingUpdateAmountChanged(data){
            this.delegatedStakingUpdateAmount = {...this.delegatedStakingUpdateAmount, ...data}
        },

        delegatedStakingNewInfoChanges(data){
            this.delegatedStakingNewInfo = {
                ...this.delegatedStakingNewInfo,
                ...data
            }
        },


    },

}
</script>