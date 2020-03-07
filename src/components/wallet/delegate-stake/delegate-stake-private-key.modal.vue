<template>

    <modal ref="modal" title="View Delegate Stake Private key" >

        <div v-if="privateKey">
            <span class="thick pd-bottom-40">Private Key of Delegate Stake</span>

            <div class="pd-bottom-40">
                <span class="font-medium-size wordwrap " >{{privateKey}} <i class="fa fa-copy pointer"  @click="copyPrivateKey"/> </span>
            </div>

            <div class="centered">
                <span class="danger">Warning: Anyone with your delegate private key can stake with your account.</span>
            </div>
        </div>

        <div v-if="!privateKey">

            <div v-if="!errorMismatch">

                <span class="disabled" >Enter the password to view the wallet seed</span> <br/>
                <password-input v-model="walletPassword" />

                <loading-button text="Show Private Key" @submit="handleShowPrivateKey" icon="fa fa-eye"  :disabled="walletPassword.length === 0" />

            </div>

            <span v-if="error" class="centered danger">
                {{error}}
            </span>

        </div>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"

export default {

    components: { Modal, PasswordInput, LoadingButton },

    data(){
        return {

            delegate: null,

            walletPassword: '',
            privateKey: '',

            error:'',
            errorMismatch: true,
        }
    },

    props:{
        address: null,
    },

    computed:{

        encrypted(){
            return this.$store.state.wallet.encrypted;
        }

    },

    methods: {

        showModal(delegate,) {

            Object.assign(this.$data, this.$options.data());

            this.delegate = delegate;

            this.$refs.modal.showModal();

            if (!this.encrypted)
                return this.handleShowPrivateKey( () => { });

        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        async handleShowPrivateKey(resolve){

            this.error = '';

            try{

                const checkPassword = await PandoraPay.wallet.encryption.checkPassword(this.password);
                if (!checkPassword)
                    throw 'Password invalid';


                const addressWallet = PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.address, false, this.walletPassword );
                const delegatePrivateAddress = addressWallet.decryptDelegateStakePrivateAddress( this.delegate.delegateNonce, this.walletPassword );

                const delegatePublicKey = delegatePrivateAddress.publicKey.toString("hex");
                if (delegatePublicKey !== this.delegate.delegatePublicKey) {
                    this.errorMismatch = true;
                    throw 'Either the (delegateNonce, delegatePublicKey) are not right or the delegatePublicKey was set manually';
                }

                const privateKey = delegatePrivateAddress.privateKey;
                this.privateKey = privateKey.toString("hex");

            }catch(err){
                this.error = err;
            }finally{
                resolve(true);
            }

        },

        copyPrivateKey(){

            this.$copyText(this.privateKey).then( e =>
                    this.$notify({
                        type: 'success',
                        title: `Copied to clipboard successfully`,
                        text: `Private Key ${this.privateKey} copied to clipboard`,
                    }),
                e =>
                    this.$notify({
                        type: 'error',
                        title: `Clipboard failed`,
                        text: `Failed to copy to clipboard`,
                    })
            )

        }

    }

}
</script>

<style scoped>
    span{
        display: inline-block
    }
    .wordwrap{
        display: block;
    }
</style>