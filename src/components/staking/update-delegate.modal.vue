<template>

    <modal ref="modal" title="Update Delegate" content-class="">

        <template slot="body" v-if="!isLoading && isFound" >

            <wizzard :titles="[
                {icon: 'fas fa-edit', name: 'Edit', tooltip: 'Update' },
                {icon: 'fas fa-pencil-alt', name: 'Extra Info', tooltip: 'Extra information attached in the tx' },
                {icon: 'fas fa-dollar-sign', name: 'Fee', tooltip: 'Setting the fee' }]"
                     @setTab="setTab" controls-class-name="modal-footer bg-light" :buttons="buttons" >

                <template slot="tab_0">
                    <div class="form pb-2">
                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">New Delegated Stake Public Key:</label>
                        <i class="fa fa-question " v-tooltip.bottom="`Public key of the delegator.`" />
                        <input class="form-control" type="text" v-model="newDelegatedStakePublicKey" >
                    </div>
                    <div class="form pb-2">
                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">New Delegated Stake Fee:</label>
                        <i class="fa fa-question " v-tooltip.bottom="`Public key of the delegator.`" />
                        <input class="form-control" type="number" v-model="newDelegatedStakeFee" min="0" max="65535" >
                        <label>in Percentage: {{newDelegatedStakeFee/65535*100}}%</label>
                    </div>
                </template>

                <template slot="tab_1">
                    <extra-data @changed="changedExtraData" />
                </template>

                <template slot="tab_2">
                    <tx-fee :balances="balances" :allow-zero="true" @changed="changedFee" :asset="''" />
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
export default {

    components: {TxFee, Modal, AlertBox, ExtraData, Wizzard},

    data(){
        return {
            publicKey: "",

            fee: {},
            extraData: { },

            newDelegatedStakePublicKey: 0,
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
        balances(){
            return this.account && this.account.accounts ? this.account.accounts : [];
        },
        balancesStakeAvailable(){
            return (this.account && this.account.delegatedStake) ? [{ amount: this.account.delegatedStake.stakeAvailable, asset: ""}] : [{ amount: 0, asset: ""}]
        },
        buttons(){
            return { 2: { icon: 'fa fa-unlink', text: 'Unstake now' }}
        }
    },

    methods:{

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === 0 && value === 1){

                }

                if (oldTab === 1 && value === 2)
                    if (this.extraData.validationError) throw this.extraData.validationError

                if (oldTab === 2 && value === 3){
                    if (this.fee.feeAuto.validationError) throw this.fee.feeAuto.validationError
                    if (this.fee.feeManual.validationError) throw this.fee.feeManual.validationError

                    await this.handleUnstake()
                }

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },

        changedExtraData(data){
            this.extraData = { ...this.extraData,  ...data, }
        },
        changedFee(data){
            this.fee = { ...this.fee, ...data }
        },

        showModal( publicKey ) {
            Object.assign(this.$data, this.$options.data());
            this.publicKey = publicKey;
            return this.$refs.modal.showModal();
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        async handleUnstake(){

            this.status = '';

            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            const out = await PandoraPay.transactions.builder.createUnstakeTx_Float( JSON.stringify({
                from: this.address.addressEncoded,
                nonce: 0,
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
