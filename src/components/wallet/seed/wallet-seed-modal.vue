<template>

    <modal ref="modal" title="Wallet Seed" >

        <div v-if="seed">

            <secret-text :text="seed" title="Seed"  />

        </div>

        <div v-if="!seed">
            <span class="gray" >Enter the password to view the wallet seed</span>
            <password-input v-model="password" />

            <div v-if="error" class="alert alert-warning border-2 d-flex align-items-center" role="alert">
                <div class="bg-warning me-3 icon-item"><i class="fa fa-error"></i> </div>
                <p class="mb-0 flex-1">{{error}}</p>
            </div>

            <loading-button text="Show Wallet Seed" @submit="handleShowSeed" icon="fa fa-key"  :disabled="!password.length " />

        </div>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import PasswordInput from "../../utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import SecretText from "src/components/utils/secret-text"

export default {

    components: {PasswordInput, Modal, LoadingButton, SecretText},

    data(){
        return {
            seed: '',
            password: '',
            error: '',
        }
    },

    computed:{

        encrypted(){
            return this.$store.state.wallet.encrypted;
        }

    },

    methods: {

        showModal() {

            Object.assign(this.$data, this.$options.data());
            this.$refs.modal.showModal();

            return this.handleShowSeed( ()=>{} );
        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        async handleShowSeed(resolve){

            this.error = '';

            try{

                // const checkPassword = await PandoraPay.wallet.encryption.checkPassword(this.password);
                // if (!checkPassword)
                //     throw Error('Password invalid');

                this.seed = this.$store.state.wallet.mnemonic;

            }catch(err){
                this.error = err.message;
            }finally{
                resolve(true);
            }
        },

        copySeed(){

            this.$copyText(this.seed).then( e =>
                this.$notify({
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `The <strong>wallet seed has been copied</strong> to clipboard.`,
                }),
                e =>
                this.$notify({
                    type: 'error',
                    title: `Clipboard failed`,
                    text: `Failed to copy to clipboard`,
                })
            );

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

    .seed{
        display: inline-block;
    }

</style>
