<template>

    <modal ref="modal" title="Unstake" content-class="">

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
                                    <span class="d-none d-md-block mt-1 fs--1">Extra Info</span>
                                </span>
                            </li>
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===2?'active':''} fw-semi-bold`">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-dollar-sign"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Fee</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body py-3">
                        <div class="tab-content">
                            <div :class="`tab-pane ${tab===0?'active':''} `">
                                <destination-amount :allow-zero="true" :allow-token="false" :balances="balancesOnlyNative" @changed="amountChanged" text="Amount to unstake" />
                            </div>
                            <div :class="`tab-pane ${tab===1?'active':''} `">
                                <extra-data :version="version.VERSION_TRANSPARENT" @changed="changedExtraData" />
                            </div>
                            <div :class="`tab-pane ${tab===2?'active':''} `">

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
                <loading-button text="Withdraw Delegated Stake" @submit="handleStopDelegateStake" icon="fa fa-unlink"  />
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
import DestinationAmount from "src/components/send/tx-amount"

export default {

    components: {Modal, PasswordInput, LoadingButton, AlertBox, DestinationAmount},


    data(){
        return {
            tab: 0,

            withdrawStakeAmount: 0,
            error: '',
            status: '',
        }
    },

    props:{
    },

    computed:{
        version: () => version,
        publicKeyHash(){
            return this.$store.state.wallet.mainPublicKeyHash
        },
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
        balancesOnlyNative(){
            const account = this.account
            if (!account || !account.delegatedStake) return [{ amount: 0, token: ""}]
            return [{ amount: account.delegatedStake.stakeAvailable, token: ""}]
        },
    },

    methods:{

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
            return this.setTab(this.tab - 1)
        },
        handleNext(){
            return this.setTab(this.tab + 1)
        },

        amountChanged(data){
            if (data.amount !== undefined) this.withdrawStakeAmount = data.amount
        },

        changedFeeManual(data){
            this.feeManual = { ...this.feeManual,  ...data, }
        },
        changedFeeAuto(data){
            this.feeAuto = { ...this.feeAuto,  ...data, }
        },
        changedExtraData(data){
            this.extraData = { ...this.extraData,  ...data, }
        },

        showModal( ) {
            Object.assign(this.$data, this.$options.data());

            this.withdrawStakeAmount = (this.account && this.account.delegatedStake) ? this.account.delegatedStake.stakeAvailable : 0;

            return this.$refs.modal.showModal();
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        async handleStopDelegateStake(resolve){

            try {

                const nonce = await Consensus.downloadNonceIncludingMemPool( this.address.address );
                if (nonce === undefined) throw Error("The connection to the node was dropped");

                const out = await PandoraPay.wallet.transfer.delegateStake({
                    address: this.address.address,
                    fee: 1,
                    nonce,
                    delegate:{
                        delegateStakeNonce: this.delegateStakeNonce,
                        delegateStakePublicKey: Buffer.alloc(20),
                        delegateStakeFee: 0,
                    },
                    memPoolValidateTxData: false,
                });

                if (!out) throw Error("Transaction couldn't be made");

                const outConsensus = await Consensus._client.emitAsync("mem-pool/new-tx", {tx: out.tx.toBuffer() }, 0);
                if (!outConsensus) throw Error("Transaction was not included in MemPool");

                Consensus.includeTransactionToPending(out.tx);

                this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Delegate Staking Transaction created`,
                    text: `Delegate Staking Transaction has been made. \n TxId ${out.bloom.tx}`,
                });

                this.$router.push(`/explorer/tx/${out.tx.hash()}`);

                this.closeModal();

            }catch(err){
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
