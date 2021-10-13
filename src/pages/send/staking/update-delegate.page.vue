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
                <div class="form-group pt-4">
                    <input class="form-check-input" id="set-new-delegated-info" type="checkbox"  name="checkbox" v-model="hasNewDelegatedInfo"  >
                    <label class="form-check-label" for="set-new-delegated-info" >Set new Delegated Info</label>
                </div>

                <div v-if="hasNewDelegatedInfo" class="pt-2 ms-2">

                    <div class="form-group pt-2">
                        <loading-button text="Auto Generate Public Key Hash" icon="fa fa-cogs" @submit="handleDeriveDelegatedStake"></loading-button>
                    </div>

                    <div class="form-group pt-2">
                        <loading-button text="Select Node" icon="fa fa-laptop-code" @submit="handleShowDelegateStakeNode"  ></loading-button>
                    </div>

                    <div class="form pt-2">
                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">New Delegated Stake Public Key:</label>
                        <i class="fa fa-question " v-tooltip.bottom="`Public key of the delegator.`" />
                        <input :class="`form-control ${validationDelegatedStakingNewPublicKey ? 'is-invalid' : ''}`" type="text" v-model="delegatedStakingNewPublicKey"  >
                        <div v-if="validationDelegatedStakingNewPublicKey" class="invalid-feedback d-block">{{validationDelegatedStakingNewPublicKey}}</div>
                    </div>

                    <div class="form pt-2">
                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">New Delegated Stake Fee:</label>
                        <i class="fa fa-question " v-tooltip.bottom="`Public key of the delegator.`" />
                        <input class="form-control" type="number" v-model="delegatedStakingNewFee" min="0" max="65535" >
                        <label>in Percentage: {{delegatedStakingNewFee/65535*100}}%</label>
                    </div>
                </div>

                <delegate-stake-node-modal ref="refDelegateStakeNodeModal" />

            </template>

        </simple-tx>

    </layout>

</template>

<script>
import TxAmount from "src/components/send/tx-amount"
import SimpleTx from "src/components/send/txs/simple-tx"
import LoadingButton from "src/components/utils/loading-button";
import DelegateStakeNodeModal from "src/components/staking/delegate-stake-node.modal"
import Layout from "src/components/layout/layout";
import LayoutTitle from "src/components/layout/layout-title";

export default {

    components: {LayoutTitle, Layout, LoadingButton, SimpleTx, TxAmount, DelegateStakeNodeModal },

    data(){
        return {
            delegatedStakingUpdateAmount: {},

            hasNewDelegatedInfo: false,

            delegatedStakingNewPublicKey: "",
            delegatedStakingNewFee: 0,
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
        validationDelegatedStakingNewPublicKey(){

            if (!this.hasNewDelegatedInfo) return

            try{
                const buffer = Buffer.from(this.delegatedStakingNewPublicKey, "hex")
                if (buffer.length !== 33) return "It must be 66 hex"
            }catch(err){
                return "Invalid Hex input"
            }
        },
        txData(){
            return {
                delegatedStakingNewPublicKey: this.hasNewDelegatedInfo ? (this.delegatedStakingNewPublicKey ? this.delegatedStakingNewPublicKey : "") : "",
                delegatedStakingNewFee: this.hasNewDelegatedInfo ? this.delegatedStakingNewFee : 0,
                delegatedStakingUpdateAmount: this.delegatedStakingUpdateAmount.amount,
            }
        }
    },

    methods:{

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === 0 && value === 1){
                    if (this.delegatedStakingUpdateAmount.validationError) throw this.delegatedStakingUpdateAmount.validationError
                    if (this.validationDelegatedStakingNewPublicKey) throw this.validationDelegatedStakingNewPublicKey

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

        async handleShowDelegateStakeNode(resolver){
            try{
                const output = await this.$refs.refDelegateStakeNodeModal.showModal(this.publicKey)
                if (output){
                    this.hasNewDelegatedInfo = true
                    this.delegatedStakingNewPublicKey = output.delegateStakingPublicKey
                    this.delegatedStakingNewFee = output.delegatesFee
                }
            }finally{
                resolver(true)
            }
        },

        async handleDeriveDelegatedStake(resolver){
            try{

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                const nonce = this.account && this.account.plainAccount ? this.account.plainAccount.nonce : 0

                const out = await PandoraPay.wallet.deriveDelegatedStakeWalletAddress( nonce.toString(), this.address.addressEncoded, password )
                const json = JSON.parse(MyTextDecode(out))

                this.hasNewDelegatedInfo = true
                this.delegatedStakingNewPublicKey = json.publicKey

            }finally{
                resolver(true)
            }
        }

    },

}
</script>