<template>

    <modal ref="modal" title="Stop Delegate Stake">

        <template slot="body">

            <destination-amount :allow-zero="true" :allow-token="false" :balances="balancesOnlyNative" @changed="amountChanged" />

            <extra-data :version="version.VERSION_TRANSPARENT" @changed="changedExtraData" />

        </template>

        <template slot="footer">

            <alert-box v-if="error" class="w-100" type="error">{{error}}</alert-box>

            <label v-if="status">{{status}}</label>

            <div class="float-end">
                <loading-button text="Withdraw Delegated Stake" @submit="handleStopDelegateStake" icon="fa fa-unlink"  />
            </div>

        </template>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import AlertBox from "src/components/utils/alert-box"
import DestinationAmount from "src/components/send/destination-amount"

export default {

    components: {Modal, PasswordInput, LoadingButton, AlertBox, DestinationAmount},


    data(){
        return {
            withdrawStakeAmount: 0,
            error: '',
            status: '',
        }
    },

    props:{
    },

    computed:{

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

        amountChanged(data){
            if (data.amount !== undefined) this.withdrawStakeAmount = data.amount
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
