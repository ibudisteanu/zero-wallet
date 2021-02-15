<template>

    <modal ref="modal" title="Delegate Stake">

        <span class="disabled">Delegate PublicKeyHash</span>
        <div class="delegate-pub-key">
            <input type="text" v-model="delegatePublicKeyHash">
            <div class="btn">
                <div class="btn-round" @click="handleGenerateDelegatePublicKey" v-tooltip.bottom="'Generate delegate public key'" >
                    <i class="fa fa-tools"></i>
                </div>
            </div>
        </div>

        <span class="disabled">Delegate Nonce</span>
        <input type="number" v-model="delegateNonce" min="0" disabled="true" >

        <span class="disabled">Delegate Fee in Percentage</span>
        <input type="number" v-model="delegateFee" min="0" max="100" step="0.01">

        <span v-if="error" class="danger">
            {{error}}
        </span>

        <loading-button text="Delegate Stake" @submit="handleDelegateStake" icon="fa fa-link"  />

        <span class="center">A transaction will be created in order to delegate your funds for staking. You will need to wait for the transaction to be confirmed.</span>

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

            delegatePublicKeyHash: '',
            delegateNonce: 0,
            delegateFee: 0,
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

        async handleGenerateDelegatePublicKey(){

            this.error = '';

            try {

                const addressWallet = PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.address, false);
                const delegatePrivateModel = addressWallet.decryptGetDelegateStakePrivateKeyModel(this.delegateNonce + 1 );
                const addressModel = delegatePrivateModel.getAddressPublicKey();
                this.delegatePublicKeyHash = addressModel.publicKeyHash.toString("hex");

            }catch(err){
                this.error = err.message;
            }finally{
            }


        },

        async handleDelegateStake(resolve){

            try {

                if (this.delegatePublicKeyHash.length !== 40  ) throw new Error("Delegate Public Key Hash is not 40 hex digits");
                if ( !kernel.helpers.StringHelper.isHex(this.delegatePublicKeyHash) ) throw Error("Delegate Public key is invalid");

                if (this.delegateFee < 0 || this.delegateFee > 100) throw Error("DelegateFee must be between 0 and 100");
                const delegateFee = Math.floor( this.delegateFee / 100 * PandoraPay.argv.transactions.staking.delegateStakingFeePercentage );

                let delegateNonce = this.delegateNonce;

                const addressWallet = PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.address, false);
                const delegatePrivateModel = addressWallet.decryptGetDelegateStakePrivateKeyModel(this.delegateNonce + 1 );
                const addressModel = delegatePrivateModel.getAddressPublicKey();
                if (this.delegatePublicKeyHash === addressModel.publicKeyHash.toString("hex") )
                    delegateNonce += 1;

                const nonce = await Consensus.downloadNonceIncludingMemPool( this.address.address );
                if (nonce === undefined) throw Error("The connection to the node was dropped");

                const out = await PandoraPay.wallet.transfer.delegateStake({
                    address: this.address.address,
                    fee: 1,
                    nonce,
                    delegate:{
                        delegateNonce: delegateNonce,
                        delegatePublicKeyHash: this.delegatePublicKeyHash,
                        delegateFee: delegateFee,
                    },
                    memPoolValidateTxData: false,
                });

                if (!out) throw Error("Transaction couldn't be made");

                const outConsensus = await Consensus._client.emitAsync("mem-pool/new-tx", {tx: out.tx.toBuffer() }, 0);
                if (!outConsensus) throw Error("Transaction was not included in MemPool");

                await Consensus.downloadAccountTransactions(this.address.address);

                this.$notify({
                    type: 'success',
                    title: `Delegate Staking Transaction created`,
                    text: `Delegate Staking Transaction has been made. \n TxId ${out.tx.hash().toString("hex")}`,
                });

                this.$router.push(`/explorer/tx/hash/${out.tx.hash().toString('hex')}`);

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

    .delegate-pub-key {
        display: grid;
        grid-template-columns: 1fr 50px;
        grid-column-gap: 10px;
    }

</style>