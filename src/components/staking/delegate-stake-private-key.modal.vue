<template>

    <modal ref="modal" title="View Delegate Stake Private key" >

        <span class="thick">Private Key of Delegate Stake</span>

        <secret-text v-if="privateKey" class="pd-top-20" :text="privateKey" title="Private Key" warning="STAKE ON YOUR BEHALF AND TAKE YOUR REWARDS" />

        <span v-if="error" class="danger">
            {{error}}
        </span>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import LoadingButton from "src/components/utils/loading-button.vue"
import SecretText from "src/components/utils/secret-text"

export default {

    components: { Modal, LoadingButton, SecretText },

    data(){
        return {

            delegate: null,

            privateKey: '',

            error:'',
            errorMismatch: true,
        }
    },

    props:{
        address: {default: null},
    },

    computed:{

    },

    methods: {

        showModal(delegate,) {

            Object.assign(this.$data, this.$options.data());

            this.delegate = delegate;

            this.$refs.modal.showModal();

            return this.handleShowPrivateKey( () => { });

        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        async handleShowPrivateKey(resolve){

            this.error = '';

            try{

                const addressWallet = PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.address, false);
                const delegateStakePrivateKeyModel = addressWallet.decryptGetDelegateStakePrivateKeyModel(this.delegate.delegateStakeNonce );
                const delegateStakeAddressModel = delegateStakePrivateKeyModel.getAddressPublicKey();

                const delegateStakePublicKeyHash = delegateStakeAddressModel.publicKeyHash.toString("hex");
                if (delegateStakePublicKeyHash !== this.delegate.delegateStakePublicKeyHash)
                    throw Error('Either the (delegateStakeNonce, delegateStakePublicKeyHash) are not right or the delegateStakePublicKeyHash was set manually');

                const privateKey = delegateStakePrivateKeyModel.privateKey;
                this.privateKey = privateKey.toString("hex");

            }catch(err){
                this.error = err.message;
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