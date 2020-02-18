<template>

    <modal ref="modal" title="Stop Delegate Stake">

        <div v-if="isWalletEncrypted" class="pd-top-40">
            <span class="disabled">Wallet password</span> <br/>
            <password-input v-model="walletPassword"></password-input>
        </div>

        <span v-if="error" class="centered danger">
            {{error}}
        </span>

        <loading-button text="Stop Delegate Stake" @submit="handleStopDelegateStake" icon="fa fa-unlink"  />

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"

export default {

    components: {Modal, PasswordInput, LoadingButton},


    data(){
        return {
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


        async handleStopDelegateStake(resolve){

            try {

                const checkPassword = await PandoraPay.wallet.encryption.checkPassword(this.walletPassword);
                if (!checkPassword)
                    this.error = "Your wallet password is invalid";

            }catch(err){
                this.error = err.message;
            }finally{
                resolve(true);
            }

        }

    },

}
</script>

<style>

</style>