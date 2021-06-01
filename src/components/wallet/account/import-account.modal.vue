<template>

    <modal ref="modal" title="Import Account" >

        <input class="importAddresses" ref="refImportedAddresses" type="file" v-on:change="handleImportAccounts"  size="50" accept=".pandora" />

        <div v-if="!address">

            <div class="btn">
                <div class="btn-round" @click="importAccount" v-tooltip.bottom="'Upload file'" >
                    <i class="fa fa-upload"></i>
                </div>
            </div>
            <span @click="importAccount" class="thick importAccountText">Select file to be imported</span>

        </div>

        <div v-if="address">

            <span class="thick">Wallet to import </span>
            <span>Name: {{address.name}}</span>
            <span>Encrypted: {{this.isAddressEncrypted}}</span>

            <div v-if="isAddressEncrypted" class="pd-top-40">
                <span class="gray">Address password</span>
                <password-input v-model="addressPassword"></password-input>
            </div>

            <div v-if="isWalletEncrypted" class="pd-top-40">
                <span class="gray">Wallet password</span>
                <password-input v-model="walletPassword"></password-input>
            </div>

            <loading-button text="Import Account" @submit="handleProcess" icon="fa fa-upload"  :disabled="(isAddressEncrypted && !walletPassword.length) || (isWalletEncrypted && !walletPassword.length ) " />

        </div>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import PasswordInput from "../../utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"

export default {

    components: {PasswordInput, Modal, LoadingButton },

    data(){
        return {
            address: null,
            addressData: '',
            addressPassword: '',
            walletPassword: '',
        }
    },

    computed:{

        isAddressEncrypted(){
            return false;
        },

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

        importAccount(){

            this.$refs.refImportedAddresses.click();

        },

        handleImportAccounts(){


            if ((window.File && window.FileReader && window.FileList && window.Blob) === false)
                return this.$notify({
                    type: 'error',
                    title: `Import Error`,
                    text: `Your browser/device doesn't support file import.`,
                });


            const file = this.$refs.refImportedAddresses.files[0];

            if (!file)
                return this.$notify({
                    type: 'error',
                    title: `Import Error`,
                    text: `No file selected.`,
                });


            let extension = file.name.split('.').pop();

            if (extension !== "pandora") {
                return this.$notify({
                    type: 'error',
                    title: `Import Error`,
                    text: `File not supported. Maybe wrong file? `,
                });
            }

            let reader = new FileReader();

            try {
                reader.onload = async (e) => {

                    const data = JSON.parse(reader.result);

                    console.log("data", data);
                    this.address = data;
                    this.addressData = reader.result;

                }

            } catch (exception){
                this.$notify({
                    type: 'error',
                    title: `Import Error`,
                    text: `Your file is not a valid JSON file. Maybe wrong file? `,
                });
            }

            reader.readAsText(file);

        },

        async handleProcess(resolve){


            try{

                this.$store.state.page.refLoadingModal.showModal();

                const out = await PandoraPay.wallet.manager.importWalletAddressJSON( this.addressData, this.addressPassword );

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


    .btn{
        display: inline-block;
    }

    .importAddresses {
        position: fixed;
        top: -1000px;
    }

    .importAccountText{
        cursor: pointer;
    }

</style>
