<template>

    <modal ref="modal" :title="`${ address ? address.name : '' }`" >

        <div v-if="privateKey">
            <span class="thick pd-bottom-40">Private Key of Address</span>

            <div class="pd-bottom-40">
                <span class="font-medium-size wordwrap " >{{privateKey}} <i class="fa fa-copy pointer"  @click="copyPrivateKey"/> </span>
            </div>

            <div class="centered">
                <span class="danger">Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.</span>
            </div>
        </div>

        <div v-if="!privateKey">

            <span class="disabled" >Enter the password to view the wallet seed</span> <br/>
            <password-input v-model="walletPassword" />


            <span v-if="error" class="centered danger">
                {{error}}
            </span>

            <loading-button text="Show Private Key" @submit="handleShowPrivateKey" icon="fa fa-eye"  :disabled="walletPassword.length === 0" />

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
            walletPassword: '',
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

                const checkPassword = await PandoraPay.wallet.encryption.checkPassword(this.walletPassword);
                if (!checkPassword)
                    throw 'Password invalid';

                const address = await PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.address );
                if (!address) throw {message: "Address not found"};

                const privateKey = address.keys.decryptPrivateKey();
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