<template>

    <modal ref="modal" title="Delegate Stake" content-class="">

        <template slot="body">

            <alert-box v-if="!isLoading && !isFound" type="warning" >
                Address doesn't exist (is empty)!
            </alert-box>
            <template v-else>

                <div class="card theme-wizard">
                    <div class="card-header bg-light py-3">
                        <ul class="nav justify-content-between nav-wizard">
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===0?'active':''} fw-semi-bold`">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-users"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Amount</span>
                                </span>
                            </li>
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===1?'active':''} fw-semi-bold`">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-pen"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Options</span>
                                </span>
                            </li>
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===2?'active':''} fw-semi-bold`">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-pen"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Extra Info</span>
                                </span>
                            </li>
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===3?'active':''} fw-semi-bold`">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-dollar-sign"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Fee</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body py-3">
                        <div class="tab-content">
                            <div :class="`tab-pane ${tab===0?'active':''} `">
                                <tx-amount :allow-zero="true" :allow-token="false" :balances="balancesOnlyNative" @changed="amountChanged" text="Amount to stake" />
                            </div>
                            <div :class="`tab-pane ${tab===1?'active':''} `">

                                <div class="form-group">
                                    <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Nonce</label>
                                    <input class="form-control" type="number" v-model="nonce" min="0"  >
                                </div>

                                <div class="form-group pt-4">
                                    <input class="form-check-input" id="hasNewDelegatedStakePublicKeyHash" type="checkbox"  name="checkbox" v-model="hasNewDelegatedStakePublicKeyHash"  >
                                    <label class="form-check-label" for="hasNewDelegatedStakePublicKeyHash"> Set a new Delegated Public Key Hash </label>
                                </div>

                                <div v-if="hasNewDelegatedStakePublicKeyHash" class="pt-2 ms-2">

                                    <div class="form-group pt-2">
                                        <input class="form-check-input" id="delegateNewPublicKeyHashGenerate" type="checkbox"  name="checkbox" v-model="delegateNewPublicKeyHashGenerate"  :disabled="disableNewDelegatedStakePublicKeyHash" >
                                        <label class="form-check-label" for="delegateNewPublicKeyHashGenerate"> Auto Generate Public Key Hash </label>
                                    </div>

                                    <template v-if="!delegateNewPublicKeyHashGenerate">
                                        <div class="form-group pt-2">
                                            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Delegate PublicKeyHash</label>
                                            <input :class="`form-control ${validationDelegateStakePublicKeyHash ? 'is-invalid' : ''}`" type="text" v-model="delegateStakePublicKeyHash"  :disabled="disableNewDelegatedStakePublicKeyHash" >
                                            <div v-if="validationDelegateStakePublicKeyHash" class="invalid-feedback d-block">{{validationDelegateStakePublicKeyHash}}</div>
                                        </div>
                                    </template>

                                    <div class="form-group pt-2">
                                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Delegate Fee in Percentage: {{delegateStakeFee/65535*100}}%</label>
                                        <input class="form-control" type="number" v-model="delegateStakeFee" min="0" max="65535" step="1"  :disabled="disableNewDelegatedStakePublicKeyHash" >
                                    </div>

                                </div>

                            </div>
                            <div :class="`tab-pane ${tab===2?'active':''} `">
                                <extra-data :version="version.VERSION_TRANSPARENT" @changed="changedExtraData" />
                            </div>
                            <div :class="`tab-pane ${tab===3?'active':''} `">
                                <tx-fee :balances="balancesOnlyNative" :allow-zero="true" @changed="changedFee" />
                            </div>

                        </div>
                    </div>
                </div>

            </template>

        </template>
        <template slot="footer">

            <alert-box v-if="error" class="w-100" type="error">{{error}}</alert-box>

            <label v-if="status">{{status}}</label>

            <div class="float-end">
                <loading-button v-if="tab > 0" text="Back" @submit="handleBack" icon="fas fa-chevron-left ms-2" classCustom="btn btn-link" :iconLeft="false" />
                <loading-button :text="`${tab === maxTab ? 'Delegate' : 'Next'}`" @submit="handleNext" :icon="`${ tab === maxTab ? 'fa fa-link' : 'fas fa-chevron-right ms-2' }`"  />
            </div>

        </template>

    </modal>

</template>

<script>
import TxFee from "../send/tx-fee";
const {version} = PandoraPay.enums.wallet.address;

import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import AlertBox from "src/components/utils/alert-box"
import TxAmount from "src/components/send/tx-amount"
import ExtraData from "src/components/send/extra-data"

export default {

    components: {TxFee, Modal, PasswordInput, LoadingButton, AlertBox, TxAmount, ExtraData},


    data(){
        return {

            publicKeyHash: "",

            tab: 0,
            maxTab: 3,

            disableNewDelegatedStakePublicKeyHash: false,

            hasNewDelegatedStakePublicKeyHash: false,
            delegateNewPublicKeyHashGenerate: true,

            nonce: 0,

            delegateStakePublicKeyHash: '',
            delegateStakeAmount: 0,
            delegateStakeFee: 0,

            fee: {},
            extraData: { },

            error: '',
            status: '',
        }
    },

    props:{

    },

    computed:{
        version: () => version,
        address(){
            return this.$store.state.wallet.addresses[this.publicKeyHash];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKeyHash]
        },
        isLoading(){
            return this.account === undefined
        },
        isFound(){
            return this.account !== null
        },
        balances(){
            if (this.account) return this.account.balances;
            return null
        },
        balancesOnlyNative(){
            const balances = []
            if (this.account){
                for (const balance of this.account.balances)
                    if (balance.token === "")
                        balances.push(balance)
            }

            return balances
        },

        validationDelegateStakePublicKeyHash(){

            if (this.delegateNewPublicKeyHashGenerate || !this.hasNewDelegatedStakePublicKeyHash) return

            try{
                const buffer = Buffer.from(this.delegateStakePublicKeyHash, "hex")
                if (buffer.length !== 20) return "It must be 40 hex"
            }catch(err){
                return "Invalid Hex input"
            }
        },



    },

    methods:{

        async setTab(resolver, value){
            try{

                value = Math.max( value, 0)
                value = Math.min( value, this.maxTab + 1)

                if (this.tab === 1 && value === 2){
                    if (this.validationDelegateStakePublicKeyHash) throw this.validationDelegateStakePublicKeyHash
                }
                if (this.tab === 2 && value === 3){
                    if (this.extraData.validationError) throw this.extraData.validationError
                }
                if (this.tab === 3 && value === 4){
                    if (this.fee.feeAuto.validationError) throw this.fee.feeAuto.validationError
                    if (this.fee.feeManual.validationError) throw this.fee.feeManual.validationError

                    await this.handleDelegateStake()
                }

                this.tab = value
            }catch(err) {
                console.error(err)
            }finally{
                resolver()
            }
        },

        handleBack(resolver){
            return this.setTab(resolver, this.tab - 1)
        },
        handleNext(resolver){
            return this.setTab(resolver, this.tab + 1)
        },

        async showModal( publicKeyHash, data ) {
            Object.assign(this.$data, this.$options.data());

            this.publicKeyHash = publicKeyHash
            if (data && data.delegatePublicKeyHash){
                this.hasNewDelegatedStakePublicKeyHash = true
                this.delegateNewPublicKeyHashGenerate = false
                this.delegateStakePublicKeyHash = data.delegatePublicKeyHash
                this.delegateStakeFee = data.delegatesFee
                this.disableNewDelegatedStakePublicKeyHash = true
            }

            try{
                const out = await this.$refs.modal.showModal();
                if (data && data.resolver)
                    data.resolver(out)
                return out
            }catch(err){
                if (data && data.reject)
                    data.reject(err)
            }

        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        changedFee(data){
            this.fee = { ...this.fee, ...data }
        },

        changedExtraData(data){
            this.extraData = { ...this.extraData,  ...data, }
        },

        amountChanged(data){
            if (data.amount !== undefined) this.delegateStakeAmount = data.amount
        },

        async handleDelegateStake(){

            try {

                this.error = '';
                this.status = '';

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                const out = await PandoraPay.transactions.builder.createDelegateTx_Float( JSON.stringify( {
                    from: this.address.addressEncoded,
                    nonce: this.nonce,
                    delegateAmount: this.delegateStakeAmount,
                    delegateNewPublicKeyHashGenerate: this.hasNewDelegatedStakePublicKeyHash ? this.delegateNewPublicKeyHashGenerate : false,
                    delegateNewPubKeyHash: this.hasNewDelegatedStakePublicKeyHash ? (this.delegateStakePublicKeyHash ? this.delegateStakePublicKeyHash : "") : "",
                    delegateNewFee: this.hasNewDelegatedStakePublicKeyHash ? this.delegateStakeFee : "",
                    data: {
                        data: Buffer.from(this.extraData.data).toString("hex"),
                        encrypt: this.extraData.type === "encrypted",
                        publicKeyToEncrypt: this.extraData.publicKeyToEncrypt,
                    },
                    fee: {
                        fixed: (this.fee.feeType === 'feeAuto') ? 0 : this.fee.feeManual.amount,
                        perByte: 0,
                        perByteAuto: this.fee.feeType === 'feeAuto',
                        token: this.fee.feeType === 'feeAuto' ? this.fee.feeAuto.token : this.fee.feeManual.token,
                    },
                    propagateTx: true,
                    awaitAnswer: true,
                } ), (status) => {
                    this.status = status
                }, password);

                if (!out) throw "Transaction couldn't be made";
                this.status = ''

                const tx = JSON.parse(out)

                await this.$store.dispatch('includeTx', {tx } )

                await this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Delegate Staking Transaction created`,
                    text: `Delegate Staking Transaction has been made. \n TxId ${tx.hash}`,
                });

                this.$router.push(`/explorer/tx/${tx.hash}`);

                this.closeModal();

            }catch(err){
                console.error(err);
                this.error = err.message;
            }

        }

    },


}
</script>

<style scoped>


</style>
