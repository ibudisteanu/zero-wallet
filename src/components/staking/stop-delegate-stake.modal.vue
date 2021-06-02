<template>

    <modal ref="modal" title="Stop Delegate Stake">

        <span class="gray">Delegate Nonce</span>
        <input type="number" v-model="delegateStakeNonce" min="0" disabled="true" >

        <span v-if="error" class="danger">
            {{error}}
        </span>

        <loading-button text="Stop Delegate Stake" @submit="handleStopDelegateStake" icon="fa fa-unlink"  />

        <span class="center">A transaction will be created in order to stop delegating your funds for staking. You will need to wait for the transaction to be confirmed.</span>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import Consensus from "src/consensus/consensus"

export default {

    components: {Modal, PasswordInput, LoadingButton},


    data(){
        return {
            delegate: null,
            delegateStakeNonce: 0,
            error: '',
        }
    },

    props:{
        address: {default: null},
    },

    computed:{

    },

    methods:{

        showModal( delegate ) {
            Object.assign(this.$data, this.$options.data());

            this.delegate = delegate;
            this.delegateStakeNonce = delegate ? delegate.delegateStakeNonce : 0;

            this.$refs.modal.showModal();
        },


        closeModal() {
            this.$refs.modal.closeModal();
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

                this.$notify({
                    type: 'success',
                    title: `Delegate Staking Transaction created`,
                    text: `Delegate Staking Transaction has been made. \n TxId ${out.tx.hash().toString("hex")}`,
                });

                this.$router.push(`/explorer/tx/hash/${out.tx.hash().toString('hex')}`);

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
