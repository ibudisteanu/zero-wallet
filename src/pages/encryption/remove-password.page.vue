<template>

    <layout>

        <layout-title icon="fas fa-unlock" title="Remove password">Remove the password of your wallet.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Remove your wallet password.</h5>
                    </div>
                </div>
            </div>
            <div class="card-body">

                <label>Password</label>
                <password-input :value="password" @changed="a => this.password=a"/>

            </div>

            <div class="card-body bg-light">

                <alert-box v-if="error" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''" >{{error}}</alert-box>

                <div class="text-center">
                    <loading-button text="Remove password" @submit="handleRemovePassword" icon="fas fa-unlock-alt"  :disabled="!password.length" />
                </div>

            </div>
        </div>

        <alert-box type="warning">
            <strong>Warning:</strong> <br/> <br/>
            It will remove the password for your entire wallet. But, you can encrypt it later again.
        </alert-box>

    </layout>

</template>

<script>

import PasswordInput from "src/components/utils/password-input";
import Layout from "src/components/layout/layout"
import LoadingButton from "src/components/utils/loading-button"
import AlertBox from "src/components/utils/alert-box"
import LayoutTitle from "src/components/layout/layout-title"
import UtilsHelper from "src/utils/utils-helper"

export default {

    components: {PasswordInput, Layout, LoadingButton, AlertBox, LayoutTitle },

    data(){
        return {
            password: '',
            error: '',
        }
    },

    methods: {

        async handleRemovePassword(resolve){

            try{

                this.error = '';
                this.$store.state.page.refLoadingModal.showModal();

                await UtilsHelper.sleep(50 )

                const out = await PandoraPay.wallet.manager.encryption.removeEncryptionWallet( this.password );

                if (!out)
                    throw "Result is not true"

                this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Wallet has been decrypted successfully`,
                    text: `Your wallet has been decrypted. No password is required from now. You can encrypt it with a new password.`,
                });

                this.$router.push('/');

            }catch(err){
                this.error = err.toString();
            }finally{
                this.$store.state.page.refLoadingModal.closeModal();
                resolve(true);
            }

        },

    }

}

</script>

<style scoped>

</style>
