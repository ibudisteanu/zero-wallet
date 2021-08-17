<template>

    <modal ref="modal" title="Delegate Stake" content-class="">

        <template slot="body">

            <alert-box v-if="!isLoading && !isFound" type="warning" >
                Address doesn't exist!
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
                                <destination-amount :allow-zero="true" :allow-token="false" :balances="balancesOnlyNative" @changed="amountChanged" text="Amount to stake" />
                            </div>
                            <div :class="`tab-pane ${tab===1?'active':''} `">

                                <div class="form-group">
                                    <input class="form-check-input" id="newDelegatedStakePublicKeyHash" type="checkbox"  name="checkbox" v-model="newDelegatedStakePublicKeyHash"  >
                                    <label class="form-check-label" for="newDelegatedStakePublicKeyHash"> Set a new Delegated Public Key Hash </label>
                                </div>

                                <div v-if="newDelegatedStakePublicKeyHash" class="pt-2 ms-2">

                                    <div class="form-group">
                                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Delegate Nonce</label>
                                        <input class="form-control" type="number" v-model="delegateStakeNonce" min="0"  >
                                    </div>

                                    <div class="form-group pt-2">
                                        <input class="form-check-input" id="delegateNewPublicKeyHashGenerate" type="checkbox"  name="checkbox" v-model="delegateNewPublicKeyHashGenerate"  >
                                        <label class="form-check-label" for="delegateNewPublicKeyHashGenerate"> Auto Generate Public Key Hash </label>
                                    </div>

                                    <template v-if="!delegateNewPublicKeyHashGenerate">
                                        <div class="form-group pt-2">
                                            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Delegate PublicKeyHash</label>
                                            <input :class="`form-control ${validationDelegateStakePublicKeyHash ? 'is-invalid' : ''}`" type="text" v-model="delegateStakePublicKeyHash">
                                            <div v-if="validationDelegateStakePublicKeyHash" class="invalid-feedback d-block">{{validationDelegateStakePublicKeyHash}}</div>
                                        </div>
                                    </template>

                                    <div class="form-group pt-2">
                                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Delegate Fee in Percentage</label>
                                        <input class="form-control" type="number" v-model="delegateStakeFee" min="0" max="100" step="0.01">
                                    </div>

                                </div>

                            </div>
                            <div :class="`tab-pane ${tab===2?'active':''} `">
                                <extra-data :version="version.VERSION_TRANSPARENT" @changed="changedExtraData" />
                            </div>
                            <div :class="`tab-pane ${tab===3?'active':''} `">
                                <div class="form-check">
                                    <input class="form-check-input" id="feeAuto" type="radio" value="feeAuto" v-model="feeType" />
                                    <label class="form-check-label" for="feeAuto">Auto fee</label>
                                </div>
                                <destination-amount class="pb-4" v-if="feeType === 'feeAuto'" text="Fee Amount" :balances="balancesOnlyNative" @changed="changedFeeAuto" :allow-zero="true" :allow-amount="false" />

                                <div class="form-check">
                                    <input class="form-check-input" id="feeManual" type="radio" value="feeManual" v-model="feeType" />
                                    <label class="form-check-label" for="feeManual">Manual fee</label>
                                </div>
                                <destination-amount v-if="feeType === 'feeManual'" text="Fee Amount" :balances="balancesOnlyNative" @changed="changedFeeManual" :allow-zero="true" />
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
                <button class="btn btn-link" type="button" v-if="tab > 0" @click="handleBack">
                    Back <i class="fas fa-chevron-left me-2"></i>
                </button>
                <button class="btn btn-falcon-primary" type="button" v-if="tab < 3" @click="handleNext">
                    <i class="fas fa-chevron-right ms-2"> </i> Next
                </button>
                <loading-button v-if="tab===3" text="Send funds" @submit="handleDelegateStake" icon="fa fa-link"  />
            </div>

        </template>

    </modal>

</template>

<script>
const {version} = PandoraPay.enums.wallet.address;

import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import AlertBox from "src/components/utils/alert-box"
import DestinationAmount from "src/components/send/destination-amount"
import ExtraData from "src/components/send/extra-data"

export default {

    components: {Modal, PasswordInput, LoadingButton, AlertBox, DestinationAmount, ExtraData},


    data(){
        return {
            tab: 0,

            delegateNewPublicKeyHashGenerate: true,
            newDelegatedStakePublicKeyHash: false,

            delegateStakePublicKeyHash: '',
            delegateStakeNonce: 0,
            delegateStakeAmount: 0,
            delegateStakeFee: 0,

            feeType: "feeAuto",
            feeAuto: {
                amount: 0,
                token: "",
            },
            feeManual: {
                amount: 0,
                token: "",
            },
            extraData: {
                data: "",
                type: "public",
                publicKeyToEncrypt: "",
                validationError: null,
            },

            error: '',
            status: '',
        }
    },

    props:{

    },

    computed:{
        version: () => version,

        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKeyHash] ;
        },
        account(){
            return this.$store.state.accounts.list[this.$store.state.wallet.mainPublicKeyHash]
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

            if (this.delegateNewPublicKeyHashGenerate || !this.newDelegatedStakePublicKeyHash) return

            try{
                const buffer = Buffer.from(this.delegateStakePublicKeyHash, "hex")
                if (buffer.length !== 20) return "It must be 40 hex"
            }catch(err){
                return "Invalid Hex input"
            }
        },

        validationDelegateFee(){
            // if (this.delegateStakeFee < 0 || this.delegateStakeFee > 100) return Error("DelegateFee must be between 0 and 100");
            // const delegateStakeFee = Math.floor( this.delegateStakeFee / 100 * PandoraPay.argv.transactions.staking.delegateStakingFeePercentage );
        }

    },

    methods:{

        increaseTab(value){
            this.setTab(this.tab + value)
        },
        setTab(value){
            try{

                value = Math.max( value, 0)
                value = Math.min( value, 3)

                if (this.tab === 1 && value === 2){
                    if (this.validationDelegateStakePublicKeyHash) throw this.validationDelegateStakePublicKeyHash
                    if (this.validationDelegateFee) throw this.validationDelegateFee
                }

            }catch(err){
                return
            }
            this.tab = value
        },

        handleBack(){
            return this.increaseTab(-1)
        },
        handleNext(){
            return this.increaseTab(1)
        },

        showModal(  ) {
            Object.assign(this.$data, this.$options.data());
            return this.$refs.modal.showModal();
        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        changedFeeManual(data){
            this.feeManual = {
                ...this.feeManual,
                ...data,
            }
        },

        changedFeeAuto(data){
            this.feeAuto = {
                ...this.feeAuto,
                ...data,
            }
        },

        changedExtraData(data){
            this.extraData = {
                ...this.extraData,
                ...data,
            }
        },

        amountChanged(data){
            if (data.amount !== undefined) this.delegateStakeAmount = data.amount
        },

        async handleDelegateStake(resolve){

            try {

                this.error = '';
                this.status = '';

                if (this.validationDelegateStakePublicKeyHash) throw this.validationDelegateStakePublicKeyHash
                if (this.validationDelegateFee) throw this.validationDelegateFee

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                const out = await PandoraPay.transactions.builder.createDelegateTx_Float( JSON.stringify( {
                    from: this.address.addressEncoded,
                    nonce: this.delegateStakeNonce,
                    delegateAmount: this.delegateStakeAmount,
                    delegateNewPublicKeyHashGenerate: this.newDelegatedStakePublicKeyHash ? this.delegateNewPublicKeyHashGenerate : false,
                    delegateNewPubKeyHash: this.newDelegatedStakePublicKeyHash ? (this.delegateStakePublicKeyHash ? this.delegateStakePublicKeyHash : "") : "",
                    data: {
                        data: Buffer.from(this.extraData.data).toString("hex"),
                        encrypt: this.extraData.type === "encrypted",
                        publicKeyToEncrypt: this.extraData.publicKeyToEncrypt,
                    },
                    fee: {
                        fixed: (this.feeType === 'feeAuto') ? 0 : this.feeManual.amount,
                        perByte: 0,
                        perByteAuto: this.feeType === 'feeAuto',
                        token: this.feeType === 'feeAuto' ? this.feeAuto.token : this.feeManual.token,
                    },
                    propagateTx: true,
                    awaitAnswer: true,
                } ), (status) => {
                    this.status = status
                }, password);

                if (!out) throw Error("Transaction couldn't be made");
                this.status = ''

                const tx = JSON.parse(out)

                await this.$store.dispatch('includeTx', { tx } )

                const hash = tx.hash;

                this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Transaction created`,
                    text: `A transaction has been made. \n TxId ${hash}`,
                });

                this.$router.push(`/explorer/tx/${hash}`);

                this.closeModal();

            }catch(err){
                console.error(err);
                this.error = err.message;
            }finally{
                resolve(true);
            }

        }

    },


}
</script>

<style scoped>


</style>
