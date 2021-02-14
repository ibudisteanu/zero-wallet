<template>

    <modal ref="modal" title="Import Private Key">

        <span class="disabled">Private Key</span>
        <input type="text" v-model="privateKey">

        <div v-if="isWalletEncrypted" class="pd-top-40">
            <span class="disabled">Wallet password</span>
            <password-input v-model="walletPassword"></password-input>
        </div>

        <span v-if="error" class="centered danger">
                {{error}}
        </span>

        <loading-button text="Import Private Key" @submit="importPrivateKey" icon="fa fa-file-upload"  />

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"

export default {

    components: {PasswordInput, Modal, LoadingButton },

    data(){
        return {
            selectedType: 0,
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

        showModal(selectedType) {
            Object.assign(this.$data, this.$options.data());
            this.selectedType = selectedType;
            this.$refs.modal.showModal();
        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        async importPrivateKey(resolve){

            const checkPassword = await PandoraPay.wallet.encryption.checkPassword(this.walletPassword);
            if (!checkPassword) {
                resolve(true);
                return this.error = "Your wallet password is invalid";
            }

            try{


                if (this.privateKey.length !== 64) throw {message: "Private key must be 64 hex numbers"};

                this.$store.state.page.refLoadingModal.showModal();

                const out = await PandoraPay.wallet.manager.importPrivateKeyModel( this.privateKey, this.selectedType );

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

                console.error(err);

                this.$notify({
                    type: 'error',
                    title: `Import Error`,
                    text: `Your Address couldn't be imported. ${err.message}`,
                });

            }finally{

                this.$store.state.page.refLoadingModal.closeModal();
                resolve(true);

            }


        }

    },

}
</script>

<style scoped>

</style>