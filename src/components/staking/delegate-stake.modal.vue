<template>

    <modal ref="modal" title="Delegate Stake">

        <span class="gray">Delegate PublicKeyHash</span>
        <div class="delegate-pub-key">
            <input type="text" v-model="delegateStakePublicKey">
            <div class="btn">
                <div class="btn-round" @click="handleGenerateDelegatePublicKey" v-tooltip.bottom="'Generate delegate public key'" >
                    <i class="fa fa-tools"></i>
                </div>
            </div>
        </div>

        <span class="gray">Delegate Nonce</span>
        <input type="number" v-model="delegateStakeNonce" min="0" disabled="true" >

        <span class="gray">Delegate Fee in Percentage</span>
        <input type="number" v-model="delegateStakeFee" min="0" max="100" step="0.01">

        <alert-box v-if="error" type="error">{{error}}</alert-box>

        <loading-button text="Delegate Stake" @submit="handleDelegateStake" icon="fa fa-link"  />

        <span class="center">A transaction will be created in order to delegate your funds for staking. You will need to wait for the transaction to be confirmed.</span>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import Consensus from "src/consensus/consensus"
import AlertBox from "src/components/utils/alert-box"

export default {

    components: {Modal, PasswordInput, LoadingButton, AlertBox},


    data(){
        return {
            delegate: null,

            delegateStakePublicKey: '',
            delegateStakeNonce: 0,
            delegateStakeFee: 0,
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
            this.delegateStakeNonce = delegate ? delegate.delegateStakeNonce : 0;

            this.$refs.modal.showModal();
        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        async handleGenerateDelegatePublicKey(){

            this.error = '';

            try {

                const addressWallet = PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.addressEncoded, false);
                const delegateStakePrivateKeyModel = addressWallet.decryptGetDelegateStakePrivateKeyModel(this.delegateStakeNonce + 1 );
                const delegateStakeAddressModel = delegateStakePrivateKeyModel.getAddressPublicKey();
                this.delegateStakePublicKey = delegateStakeAddressModel.publicKey.toString("hex");

            }catch(err){
                this.error = err.message;
            }finally{
            }


        },

        async handleDelegateStake(resolve){

            try {

                if (this.delegateStakePublicKey.length !== 66  ) throw Error("Delegate Public Key is not 66 hex digits");
                if ( !PandoraLibrary.helpers.StringHelper.isHex(this.delegateStakePublicKey) ) throw Error("Delegate Public key is invalid");

                if (this.delegateStakeFee < 0 || this.delegateStakeFee > 100) throw Error("DelegateFee must be between 0 and 100");
                const delegateStakeFee = Math.floor( this.delegateStakeFee / 100 * PandoraPay.argv.transactions.staking.delegateStakingFeePercentage );

                let delegateStakeNonce = this.delegateStakeNonce;

                const addressWallet = PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.addressEncoded, false);
                const delegateStakePrivateKeyModel = addressWallet.decryptGetDelegateStakePrivateKeyModel(this.delegateStakeNonce + 1 );
                const delegateStakeAddressModel = delegateStakePrivateKeyModel.getAddressPublicKey();
                if (this.delegateStakePublicKey === delegateStakeAddressModel.publicKey.toString("hex") )
                    delegateStakeNonce += 1;

                const nonce = await Consensus.downloadNonceIncludingMemPool( this.address.addressEncoded );
                if (nonce === undefined) throw Error("The connection to the node was dropped");

                const out = await PandoraPay.wallet.transfer.delegateStake({
                    address: this.address.addressEncoded,
                    fee: 1,
                    nonce,
                    delegate:{
                        delegateStakeNonce,
                        delegateStakePublicKey: this.delegateStakePublicKey,
                        delegateStakeFee: delegateStakeFee,
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

                this.$router.push(`/explorer/tx/${out.tx.hash()}`);

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
