<template>

    <modal ref="modal" title="Import Private Key">

        <span class="disabled">Private Key</span> <br/>
        <input type="text" v-model="privateKey">

        <div v-if="isWalletEncrypted" class="pd-top-40">
            <span class="disabled">Wallet password</span> <br/>
            <password-input v-model="walletPassword"></password-input>
        </div>

        <input type="submit" value="Import Private Key" @click="importPrivateKey">

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import PasswordInput from "../../utils/password-input";

export default {

    components: {PasswordInput, Modal },

    data(){
        return {
            privateKey: '',
            walletPassword: '',
            error: '',
        }
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

        async importPrivateKey(){

            this.$store.commit('setIsLoading', true);

            const checkPassword = await global.apacache.wallet.encryption.checkPassword(this.walletPassword);
            if (!checkPassword)
                this.error = "Your wallet password is invalid";


            try{

                if (this.privateKey.length !== 64) throw {message: "Private key must be 64 hex numbers"};

                const out = await global.apacache.wallet.manager.importPrivateKeyAddress( this.privateKey );

                if (out)
                    this.$notify({
                        type: 'success',
                        title: `Imported successfully`,
                        text: `Your Address has been successfully imported.`,
                    });
                else
                if (out === false )
                    this.$notify({
                        type: 'warn',
                        title: `Import Warning`,
                        text: `Your address already exists`,
                    });

                this.closeModal();

            }catch(err){
                this.$notify({
                    type: 'error',
                    title: `Import Error`,
                    text: `Your Address couldn't be imported. ${err.message}`,
                });

            }

            this.$store.commit('setIsLoading', false);




        }

    },

}
</script>

<style scoped>

</style>