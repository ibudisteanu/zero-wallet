<template>

    <modal ref="modal" title="Delegate Stake">

        <span class="disabled">Delegate Public Key</span> <br/>
        <input type="text" v-model="delegatePublicKey">

        <div class="btn-round" @click="handleDelegatePublicKey" v-tooltip.bottom="'Generate your own delegate public key'" >
            <i class="fa fa-tools"></i>
        </div>

        <span class="disabled">Delegate Nonce</span> <br/>
        <input type="number" v-model="delegateNonce" min="0" disabled="true" >

        <span class="disabled">Delegate Fee in Percentage</span> <br/>
        <input type="number" v-model="delegateFee" min="0" max="100" step="0.01">

        <div v-if="isWalletEncrypted" class="pd-top-40">
            <span class="disabled">Wallet password</span> <br/>
            <password-input v-model="walletPassword"></password-input>
        </div>

        <span v-if="error" class="centered danger">
            {{error}}
        </span>

        <loading-button text="Delegate Stake" @submit="handleDelegateStake" icon="fa fa-link"  />

        <span class="center">A transaction will be created in order to delegate your funds for staking to a third party.</span>

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

            delegatePublicKey: '',
            delegateNonce: 0,
            delegateFee: 0,
            walletPassword: '',
            error: '',
        }
    },

    props:{
        address: null,
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

        async handleDelegatePublicKey(){

            this.error = '';

            try {

                const checkPassword = await PandoraPay.wallet.encryption.checkPassword(this.walletPassword);
                if (!checkPassword)
                    throw {message: "Your wallet password is invalid"};

                const addressWallet = PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.address, false, this.walletPassword );
                const delegatePrivateAddress = addressWallet.decryptDelegatePrivateAddress(this.delegateNonce + 1, this.walletPassword);

                this.delegatePublicKey = delegatePrivateAddress.publicKey.toString("hex");

            }catch(err){
                this.error = err;
            }finally{
            }


        },

        async handleDelegateStake(resolve){

            try {

                const checkPassword = await PandoraPay.wallet.encryption.checkPassword(this.walletPassword);
                if (!checkPassword)
                    throw {message: "Your wallet password is invalid"};

                if (this.delegatePublicKey.length !== 66  ) throw {message: "Delegate Public Key is not 66 hex digits"};
                if ( !blockchain.helpers.StringHelper.isHex(this.delegatePublicKey) ) throw {message: "Delegate Public key is invalid"};

                if (this.delegateFee < 0 || this.delegateFee > 100) throw {message: "DelegateFee must be between 0 and 100"};
                const delegateFee = Math.floor( this.delegateFee / 100 * PandoraPay.argv.transactions.staking.delegateStakingFeePercentage );

                let delegateNonce = this.delegateNonce;

                const addressWallet = PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.address, false, this.walletPassword );
                const delegatePrivateAddress = addressWallet.decryptDelegatePrivateAddress(this.delegateNonce + 1, this.walletPassword);
                if (this.delegatePublicKey === delegatePrivateAddress.publicKey.toString("hex") ){
                    delegateNonce += 1;
                }

                const nonce = await Consensus.downloadNonceIncludingMemPool( this.address.address );
                if (nonce === undefined) throw {message: "The connection to the node was dropped"};

                //console.log("delegatePublicKey", delegatePublicKey);

                const out = await PandoraPay.wallet.transfer.changeDelegate({
                    address: this.address.address,
                    fee: 1,
                    nonce,
                    memPoolValidateTxData: false,
                    delegateOld:{
                        delegateNonce: this.delegate ? this.delegate.delegateNonce: 0,
                        delegatePublicKey: this.delegate ? this.delegate.delegatePublicKey : Buffer.alloc(33).toString("hex"),
                        delegateFee: this.delegate ? this.delegate.delegateFee: 0,
                    },
                    delegate:{
                        delegateNonce: delegateNonce,
                        delegatePublicKey: this.delegatePublicKey,
                        delegateFee: delegateFee,
                    },
                });

                if (!out) throw {message: "Transaction couldn't be made"};

                console.log("out", out);

                const buffer = out.tx.toHex();
                out.tx.fromHex(buffer);

                const outConsensus = await Consensus._client.emitAsync("mem-pool/new-tx", {tx: out.tx.toBuffer() }, 0);
                if (!outConsensus) throw {message: "Transaction was not included in MemPool"};

                await Consensus.downloadAccountTransactions(this.address.address);

                this.$notify({
                    type: 'success',
                    title: `Delegate Staking Transaction created`,
                    text: `Delegate Staking Transaction has been made. \n TxId ${out.tx.hash().toString("hex")}`,
                });

                this.closeModal();

            }catch(err){
                console.error(err);
                this.error = err;
            }finally{
                resolve(true);
            }

        }

    },


}
</script>

<style>

</style>