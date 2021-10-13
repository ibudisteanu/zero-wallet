<template>

    <simple-tx-page title="Update Delegate Info" subtitle="Change Delegation Information" icon="fa fa-marker"
                    :tabs-offset="1"
                    :titles-offset="[ {icon: 'fa fa-edit', name: 'Update Delegation', tooltip: 'Change delegation info' }]"
                    :tx-data="txData" @onSetTab="setTab" :buttonsOffset="buttons"
                    tx-name="createUpdateDelegateTx_Float">

        <template slot="tab_0">
            <div class="form pb-2">
                <tx-amount :validate-amount="true" :allow-zero="true" :balances="balancesOnlyClaimable" @changed="updateStakingAmountChanged" text="Update Staking Amount" asset="" tooltip="Convert claimable amount to staking amount." />
            </div>
            <div class="form-group pt-4">
                <input class="form-check-input" id="set-new-delegated-info" type="checkbox"  name="checkbox" v-model="hasNewDelegatedInfo"  >
                <label class="form-check-label" for="set-new-delegated-info" >Set new Delegated Info</label>
            </div>

            <div v-if="hasNewDelegatedInfo" class="pt-2 ms-2">

                <div class="form-group pt-2">
                    <input class="form-check-input" id="auto-generate-public-key-hash" type="checkbox" v-model="delegateNewPublicKeyGenerate"  :disabled="disableChanges" >
                    <label class="form-check-label" for="auto-generate-public-key-hash" > Auto Generate Public Key Hash </label>
                </div>

                <div class="form pb-2" v-if="!delegateNewPublicKeyGenerate">
                    <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">New Delegated Stake Public Key:</label>
                    <i class="fa fa-question " v-tooltip.bottom="`Public key of the delegator.`" />
                    <input :class="`form-control ${validationNewDelegatedStakePublicKey ? 'is-invalid' : ''}`" type="text" v-model="newDelegatedStakePublicKey"  :disabled="disableChanges" >
                    <div v-if="validationNewDelegatedStakePublicKey" class="invalid-feedback d-block">{{validationNewDelegatedStakePublicKey}}</div>
                </div>
                <div class="form pb-2">
                    <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">New Delegated Stake Fee:</label>
                    <i class="fa fa-question " v-tooltip.bottom="`Public key of the delegator.`" />
                    <input class="form-control" type="number" v-model="newDelegatedStakeFee" min="0" max="65535" :disabled="disableChanges" >
                    <label>in Percentage: {{newDelegatedStakeFee/65535*100}}%</label>
                </div>
            </div>
        </template>

    </simple-tx-page>

</template>

<script>
import TxAmount from "src/components/send/tx-amount"
import SimpleTxPage from "src/pages/send/simple/simple-tx.page"

export default {

    components: {SimpleTxPage, TxAmount },

    data(){
        return {
            updateStakingAmount: {},

            hasNewDelegatedInfo: false,
            delegateNewPublicKeyGenerate: false,
            disableChanges: false,

            newDelegatedStakePublicKey: "",
            newDelegatedStakeFee: 0,
        }
    },

    computed:{
        publicKey(){
            return this.$store.state.wallet.mainPublicKey
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
        balancesOnlyClaimable(){
            return (this.account && this.account.plainAccount ) ? { "": { amount: this.account.plainAccount.claimable, asset: "" } } : { "": { amount: 0, asset: ""} }
        },
        buttons(){
            return { 2: { icon: 'fa fa-marker', text: 'Update delegate' }}
        },
        validationNewDelegatedStakePublicKey(){

            if (this.delegateNewPublicKeyGenerate || !this.hasNewDelegatedInfo) return

            try{
                const buffer = Buffer.from(this.newDelegatedStakePublicKey, "hex")
                if (buffer.length !== 33) return "It must be 66 hex"
            }catch(err){
                return "Invalid Hex input"
            }
        },
        txData(){
            return {
                delegateNewPublicKeyGenerate: this.hasNewDelegatedInfo ? this.delegateNewPublicKeyGenerate : false,
                delegateNewPubKey: this.hasNewDelegatedInfo ? (this.newDelegatedStakePublicKey ? this.newDelegatedStakePublicKey : "") : "",
                delegateNewFee: this.hasNewDelegatedInfo ? this.newDelegatedStakeFee : 0,
                updateStakingAmount: this.updateStakingAmount.amount,
            }
        }
    },

    methods:{

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === 0 && value === 1){
                    if (this.updateStakingAmount.validationError) throw this.updateStakingAmount.validationError
                    if (this.validationNewDelegatedStakePublicKey) throw this.validationNewDelegatedStakePublicKey

                    if (this.updateStakingAmount.amount === 0 && !this.hasNewDelegatedInfo) throw "You should update something."
                }

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },
        updateStakingAmountChanged(data){
            this.updateStakingAmount = {...this.updateStakingAmount, ...data}
        },

    },

}
</script>