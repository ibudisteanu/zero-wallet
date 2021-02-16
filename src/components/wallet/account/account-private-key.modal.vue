<template>

    <modal ref="modal" :title="`Private Key of ${ address ? address.name : '' }`" >

        <span class="thick">Private Key of Your Address "{{address.name}}"</span>
        <secret-key class="pd-top-20" :text="privateKey" title="Private Key" />

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import SecretKey from "src/components/utils/secret-text"

export default {

    components: { Modal, PasswordInput, LoadingButton, SecretKey },

    data(){
        return {
            privateKey: '',
            error:'',
        }
    },

    props:{
        address: {default: null},
    },

    computed:{

        encrypted(){
            return this.$store.state.wallet.encrypted;
        }

    },

    methods: {

        showModal(address,) {

            Object.assign(this.$data, this.$options.data());

            this.address = address;

            this.handleShowPrivateKey();

            this.$refs.modal.showModal();

        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        handleShowPrivateKey(){

            this.error = '';

            try{

                const address = PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.address );
                if (!address) throw Error("Address not found");

                const privateKey = address.keys.decryptPrivateKey();
                this.privateKey = privateKey.toString("hex");

            }catch(err){
                this.error = err.message;
            }finally{
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