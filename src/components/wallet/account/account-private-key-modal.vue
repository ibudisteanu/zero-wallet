<template>

    <modal ref="modal" :title="`${ address ? address.name : '' }`" >

        <div v-if="privateKey">
            <span class="thick pd-bottom-40">Private Key</span>

            <div class="pd-bottom-40">
                <span class="font-medium-size wordwrap " >{{privateKey}} <i class="fa fa-copy pointer"  @click="copyPrivateKey"/> </span>
            </div>

            <div class="centered">
                <span class="danger">Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.</span>
            </div>
        </div>

        <div v-if="!privateKey">

            <span class="disabled" >Enter the password to view the wallet seed</span> <br/>
            <password-input v-model="password" />


            <span v-if="error" class="centered danger">
                {{error}}
            </span>

            <input type="submit" value="Show Private Key" :disabled="password.length === 0 " @click="showPrivateKey">

        </div>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";

export default {

    components: { Modal, PasswordInput },

    data(){
        return {
            address: null,
            password: '',
            privateKey: '',

            error:'',
        }
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
                return this.showPrivateKey();

        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        async showPrivateKey(){

            this.error = '';

            try{

                const checkPassword = await global.apacache.wallet.encryption.checkPassword(this.password);
                if (!checkPassword)
                    throw {message: 'Password invalid'};

                const address = await global.apacache.wallet.manager.getWalletAddressByAddress( this.address.address );
                if (!address) throw {message: "Address not found"};

                const privateKey = await address.decryptPrivateKey();
                this.privateKey = privateKey.toString("hex");

            }catch(err){
                this.error = err.message;
            }

        },

        copyPrivateKey(){

            this.$copyText(this.privateKey).then( (e) => {
                this.$notify({
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `Private Key ${this.privateKey} copied to clipboard`,
                });
            }, (e) => {
                this.$notify({
                    type: 'error',
                    title: `Clipboard failed`,
                    text: `Failed to copy to clipboard`,
                });
            })

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