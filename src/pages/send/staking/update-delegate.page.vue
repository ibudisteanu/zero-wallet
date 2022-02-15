<template>

    <layout>
        <layout-title icon="fas fa-marker" title="Update Delegate Info">Change Delegation Information</layout-title>

        <simple-tx :titles-offset="{ '-1': {icon: 'fas fa-edit', name: 'Update Delegation', tooltip: 'Change delegation info' } }"
                   @onSetTab="setTab" :buttons-offset="buttons" :public-key="publicKey" :before-process="handleBeforeProcess">

            <template v-slot:tab_-1>

                <div class="form pb-2">
                    <tx-amount :validate-amount="true" :allow-zero="true" :balances="balancesOnlyUnclaimed" @changed="delegatedStakingClaimAmountChanged" text="Update Staking" tooltip="Claim unclaimed funds to staking amount." />
                </div>

                <delegated-staking-new-info :public-key="publicKey" ref="refDelegatedStakingNewInfo" />

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
import Decimal from "decimal.js"

export default {

    components: {LayoutTitle, Layout, LoadingButton, SimpleTx, TxAmount, DelegatedStakingNewInfo },

    data(){
        return {
            delegatedStakingClaimAmount: {},
            delegatedStakingNewInfo: {},
        }
    },

    computed:{
        publicKey(){
            return this.$store.state.wallet.mainPublicKey
        },
        walletAddress(){
            return this.$store.state.wallet.addresses[this.publicKey]
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        balancesOnlyUnclaimed(){
            const amount = (this.account && this.account.plainAccount) ? this.account.plainAccount.unclaimed : new Decimal(0)
            return { [PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64]: {amount, asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64 } }
        },
        buttons(){
            return { 1: { icon: 'fas fa-marker', text: 'Update delegate' }}
        },
        getAsset() {
            return this.$store.getters.getAsset(PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64);
        },
    },

    methods:{

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === -1 && value > oldTab){
                    if (this.delegatedStakingClaimAmount.validationError) throw this.delegatedStakingClaimAmount.validationError

                    this.delegatedStakingNewInfo = this.$refs.refDelegatedStakingNewInfo.getData()
                    if (this.delegatedStakingNewInfo.validationDelegatedStakingNewPublicKey) throw this.delegatedStakingNewInfo.validationDelegatedStakingNewPublicKey

                    if (this.delegatedStakingClaimAmount.amount === 0 && !this.delegatedStakingNewInfo.hasNewDelegatedInfo) throw "You should update something."
                }

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },

        delegatedStakingClaimAmountChanged(data){
            this.delegatedStakingClaimAmount = {...this.delegatedStakingClaimAmount, ...data}
        },

        async handleBeforeProcess(password, data){

            data.extra = {
                delegatedStakingClaimAmount: this.delegatedStakingClaimAmount.amount,
                delegatedStakingUpdate: {
                    delegatedStakingHasNewInfo: this.delegatedStakingNewInfo.hasNewDelegatedInfo,
                    delegatedStakingNewPublicKey: this.delegatedStakingNewInfo.delegatedStakingNewPublicKey,
                    delegatedStakingNewFee: this.delegatedStakingNewInfo.delegatedStakingNewFee,
                }
            }
            data.txScript = new Decimal(PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_DELEGATE)
        }

    },

}
</script>