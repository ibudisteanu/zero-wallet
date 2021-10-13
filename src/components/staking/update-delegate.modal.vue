<template>

    <modal ref="modal" title="Update Delegate" content-class="">

        <template slot="body" v-if="!isLoading && isFound" >

            <wizzard :titles="[
                {icon: 'fas fa-edit', name: 'Edit', tooltip: 'Update' },
                {icon: 'fas fa-pencil-alt', name: 'Extra Info', tooltip: 'Extra information attached in the tx' },
                {icon: 'fas fa-dollar-sign', name: 'Fee', tooltip: 'Setting the fee' }]"
                     @onSetTab="setTab" controls-class-name="modal-footer bg-light" :buttons="buttons" >

                <template slot="tab_0">
                    <div class="form pb-2">
                        <tx-amount :validate-amount="true" :allow-zero="true" :accounts="accountsOnlyClaimable" @changed="updateStakingAmountChanged" text="Update Staking Amount" asset="" tooltip="Convert claimable amount to staking amount." />
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

                <template slot="tab_1">
                    <extra-data @changed="changedExtraData" />
                </template>

                <template slot="tab_2">
                    <tx-fee :balances="balancesStakeAvailable" :allow-zero="true" @changed="changedFee" :asset="''" />
                </template>

            </wizzard>

        </template>

    </modal>

</template>

<script>
import TxFee from "../send/tx-fee";
import Modal from "src/components/utils/modal"
import AlertBox from "src/components/utils/alert-box"
import ExtraData from "src/components/send/extra-data"
import Wizzard from "src/components/utils/wizzard"
import TxAmount from "src/components/send/tx-amount"

export default {

    components: {TxFee, Modal, AlertBox, ExtraData, Wizzard, TxAmount},

    data(){
        return {
            publicKey: "",

            fee: {},
            extraData: { },

            updateStakingAmount: {},

            hasNewDelegatedInfo: false,
            delegateNewPublicKeyGenerate: false,
            disableChanges: false,

            newDelegatedStakePublicKey: "",
            newDelegatedStakeFee: 0,

            status: '',
        }
    },

    computed:{
        address(){
            return this.$store.state.wallet.addresses[this.publicKey];
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
        balancesStakeAvailable(){
            return (this.account && this.account.plainAccount && this.account.plainAccount.delegatedStake) ? [{ amount: this.account.plainAccount.delegatedStake.stakeAvailable, asset: ""}] : [{ amount: 0, asset: ""}]
        },
        accountsOnlyClaimable(){
            return (this.account && this.account.plainAccount ) ? [{amount: this.account.plainAccount.claimable, asset: "" }] : [{ amount: 0, asset: ""}]
        },
        buttons(){
            return { 2: { icon: 'fa fa-unlink', text: 'Update delegate' }}
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
    },

    methods:{

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === 0 && value === 1){
                    if (this.updateStakingAmount.validationError) throw this.updateStakingAmount.validationError
                    if (this.validationNewDelegatedStakePublicKey) throw this.validationNewDelegatedStakePublicKey
                }

                if (oldTab === 1 && value === 2)
                    if (this.extraData.validationError) throw this.extraData.validationError

                if (oldTab === 2 && value === 3){
                    if (this.fee.feeAuto.validationError) throw this.fee.feeAuto.validationError
                    if (this.fee.feeManual.validationError) throw this.fee.feeManual.validationError

                    await this.handleUpdateDelegate()
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
        changedExtraData(data){
            this.extraData = { ...this.extraData,  ...data, }
        },
        changedFee(data){
            this.fee = { ...this.fee, ...data }
        },

        showModal( publicKey, data ) {
            Object.assign(this.$data, this.$options.data());
            this.publicKey = publicKey;
            if (data && data.delegatePublicKey){
                this.hasNewDelegatedInfo = true
                this.delegateNewPublicKeyGenerate = false
                this.newDelegatedStakePublicKey = data.delegatePublicKey
                this.newDelegatedStakeFee = data.delegatesFee
                this.disableChanges = true
            }
            return this.$refs.modal.showModal();
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        async handleUpdateDelegate(){

            this.status = '';

            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            const out = await PandoraPay.transactions.builder.createUpdateDelegateTx_Float( JSON.stringify({
                from: this.address.addressEncoded,
                nonce: 0,
                delegateNewPublicKeyGenerate: this.hasNewDelegatedInfo ? this.delegateNewPublicKeyGenerate : false,
                delegateNewPubKey: this.hasNewDelegatedInfo ? (this.newDelegatedStakePublicKey ? this.newDelegatedStakePublicKey : "") : "",
                delegateNewFee: this.hasNewDelegatedInfo ? this.newDelegatedStakeFee : 0,
                updateStakingAmount: this.updateStakingAmount.amount,
                data: {
                    data: Buffer.from(this.extraData.data).toString("hex"),
                    encrypt: this.extraData.type === "encrypted",
                    publicKeyToEncrypt: this.extraData.publicKeyToEncrypt,
                },
                fee: {
                    fixed: (this.fee.feeType === 'feeAuto') ? 0 : this.fee.feeManual.amount,
                    perByte: 0,
                    perByteAuto: this.fee.feeType === 'feeAuto',
                },
                propagateTx: true,
                awaitAnswer: false,
            }), (status) => {
                this.status = status
            }, password);

            if (!out) throw "Transaction couldn't be made";
            this.status = ''

            const tx = JSON.parse( MyTextDecode(out) )

            await this.$store.dispatch('includeTx', {tx } )

            await this.$store.dispatch('addToast', {
                type: 'success',
                title: `Unstake Transaction created`,
                text: `Unstake Transaction has been made. \n TxId ${tx.hash}`,
            });

            this.$router.push(`/explorer/tx/${tx.hash}`);

            this.closeModal();

        }

    },

}
</script>

<style scoped>

</style>
