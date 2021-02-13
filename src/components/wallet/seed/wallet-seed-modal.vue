<template>

    <modal ref="modal" title="Wallet Seed" >

        <div v-if="seed">

            <div class="pd-bottom-40 seed">
                <span class="font-medium-size wordwrap thick" >{{seed}} <i class="fa fa-copy pointer"  @click="copySeed"/></span>
            </div>
            <div class="centered">
                <span class="danger">Warning: DO NOT share this phrase with anyone! These words can be used to steal all your accounts.</span>
            </div>

        </div>

        <div v-if="!seed">
            <span class="disabled" >Enter the password to view the wallet seed</span>
            <password-input v-model="password" />


            <span v-if="error" class="centered danger">
                {{error}}
            </span>

            <loading-button text="Show Wallet Seed" @submit="handleShowSeed" icon="fa fa-key"  :disabled="password.length === 0" />

        </div>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import PasswordInput from "../../utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"

export default {

    components: {PasswordInput, Modal, LoadingButton},

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

            if (!this.encrypted)
                return this.handleShowSeed( ()=>{} );


        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        async handleShowSeed(resolve){

            this.error = '';

            try{

                const checkPassword = await PandoraPay.wallet.encryption.checkPassword(this.password);
                if (!checkPassword)
                    throw 'Password invalid';

                const out = await PandoraPay.wallet.encryption.decryptMnemonic();
                this.seed = out.join(' ');

            }catch(err){
                this.error = err;
            }finally{
                resolve(true);
            }
        },

        copySeed(){

            this.$copyText(this.seed).then( e =>
                this.$notify({
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `Wallet Seed ${this.seed} copied to clipboard`,
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