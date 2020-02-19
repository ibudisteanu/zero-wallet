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

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"

export default {

    components: {Modal, PasswordInput, LoadingButton},


    data(){
        return {
            delegatePublicKey: '',
            delegateNonce: 0,
            delegateFee: 0,
            walletPassword: '',
            error: '',
        }
    },

    props:{
        address: null,
        delegate: null,
    },

    computed:{

        isWalletEncrypted() {
            return this.$store.state.wallet.encrypted;
        },

    },

    methods:{

        showModal() {
            Object.assign(this.$data, this.$options.data());
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
                    throw "Your wallet password is invalid";

                const addressWallet = PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.address, false, this.password );

                const delegatePrivateAddress = addressWallet.decryptDelegatePrivateAddress(this.delegateNonce + 1, this.password);

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
                    throw "Your wallet password is invalid";

                if (this.delegatePublicKey.length !== 66  ) throw "Delegate Public Key is not 64 hex digits";
                if ( blockchain.helpers.BufferHelper.isHex(this.delegatePublicKey) ) throw "Delegate Public key is invalid";

                if (this.delegateFee < 0 || this.delegateFee > 100) throw "DelegateFee must be between 0 and 100";
                const delegateFee = Math.floor( this.delegateFee * PandoraPay.argv.transactions.staking.delegateStakingFeePercentage );

            }catch(err){
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