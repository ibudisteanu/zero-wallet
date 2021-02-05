<template>

    <modal ref="modal" title="Stop Delegate Stake">

        <span class="disabled">Delegate Nonce</span> <br/>
        <input type="number" v-model="delegateNonce" min="0" disabled="true" >

        <div v-if="isWalletEncrypted" class="pd-top-40">
            <span class="disabled">Wallet password</span> <br/>
            <password-input v-model="walletPassword"></password-input>
        </div>

        <span v-if="error" class="centered danger">
            {{error}}
        </span>

        <loading-button text="Stop Delegate Stake" @submit="handleStopDelegateStake" icon="fa fa-unlink"  />

        <span class="center">A transaction will be created in order to delegate your funds for staking to a third party. You will need to wait for the transaction to be confirmed.</span>

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
            delegateNonce: 0,
            walletPassword: '',
            error: '',
        }
    },

    props:{
        address: {default: null},
    },

    computed:{

        isWalletEncrypted() {
            return this.$store.state.wallet.encrypted;
        },

    },

    methods:{

        showModal( delegate ) {
            Object.assign(this.$data, this.$options.data());

            this.delegate = delegate;
            this.delegateNonce = delegate ? delegate.delegateNonce : 0;

            this.$refs.modal.showModal();
        },


        closeModal() {
            this.$refs.modal.closeModal();
        },


        async handleStopDelegateStake(resolve){

            try {

                const checkPassword = await PandoraPay.wallet.encryption.checkPassword(this.walletPassword);
                if (!checkPassword)
                    throw {message: "Your wallet password is invalid"};

                const nonce = await Consensus.downloadNonceIncludingMemPool( this.address.address );
                if (nonce === undefined) throw {message: "The connection to the node was dropped"};

                const out = await PandoraPay.wallet.transfer.changeDelegate({
                    address: this.address.address,
                    fee: 1,
                    nonce,
                    delegate:{
                        delegateNonce: this.delegateNonce,
                        delegatePublicKey: Buffer.alloc(33),
                        delegateFee: 0,
                    },
                    memPoolValidateTxData: false,
                });

                if (!out) throw {message: "Transaction couldn't be made"};

                const outConsensus = await Consensus._client.emitAsync("mem-pool/new-tx", {tx: out.tx.toBuffer() }, 0);
                if (!outConsensus) throw {message: "Transaction was not included in MemPool"};

                await Consensus.downloadAccountTransactions(this.address.address);

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

<style>

</style>