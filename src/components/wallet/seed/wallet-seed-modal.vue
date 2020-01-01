<template>

    <modal ref="modal" title="Wallet Seed" >

        <div v-if="seed">

            <span class="font-medium-size wordwrap pd-bottom-40 thick" >{{seed}}</span>
            <div class="centered">
                <span class="danger">Warning: DO NOT share this phrase with anyone! These words can be used to steal all your accounts.</span>
            </div>

        </div>

        <div v-if="!seed">
            <span class="disabled" >Enter the password to view the wallet seed</span> <br/>
            <password-input v-model="password" />


            <span v-if="error" class="centered danger">
                {{error}}
            </span>

            <input type="submit" value="Remove password" :disabled="password.length === 0 " @click="showSeed">
        </div>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import PasswordInput from "../../utils/password-input";

export default {

    components: {PasswordInput, Modal},

    data(){
        return {
            seed: '',
            password: '',
            error: '',
        }
    },

    computed:{

        encrypted(){
            return this.$store.state.encrypted;
        }

    },

    methods: {

        showModal() {

            Object.assign(this.$data, this.$options.data());
            this.$refs.modal.showModal();

            if (!this.encrypted)
                return this.showSeed();


        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        async showSeed(){

            this.error = '';

            try{

                const checkPassword = await global.apacache.wallet.encryption.checkPassword(this.password);
                if (!checkPassword)
                    throw 'Password invalid';

                const out = await global.apacache.wallet.encryption.decryptMnemonic();
                this.seed = out.join(' ');

            }catch(err){
                this.error = err;
            }
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