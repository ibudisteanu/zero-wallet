<template>

    <modal ref="modal" title="Import Address" @opened="opened" >

        <input class="importAddresses" ref="refImportedAddresses" type="file" v-on:change="handleImportAccounts"  size="50" />

        <div v-if="!address">

            <div class="btn">
                <div class="btn-round" @click="importAccount" v-tooltip.bottom="'Upload file'" >
                    <i class="fa fa-upload"></i>
                </div>
            </div>
            <span @click="importAccount" class="thick importAccountText">Select file to be imported</span>

        </div>

        <div v-if="address">

            <span class="thick">Wallet to import </span> <br/>
            <span>Name: {{address.name}}</span> <br/>
            <span>Encrypted: {{this.isAddressEncrypted}}</span> <br/>

            <div v-if="isAddressEncrypted" class="pd-top-40">
                <span class="disabled">Address password</span> <br/>
                <password-input v-model="addressPassword"></password-input>
            </div>

            <div v-if="isWalletEncrypted" class="pd-top-40">
                <span class="disabled">Wallet password</span> <br/>
                <password-input v-model="walletPassword"></password-input>
            </div>

            <div v-if="error" class="centered danger">
                {{error}}
            </div>

            <input type="submit" value="Import Account" @click="process">

        </div>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import PasswordInput from "../../utils/password-input";

export default {

    components: {PasswordInput, Modal },

    data(){
        return {
            address: null,
            addressData: '',
            addressPassword: '',
            walletPassword: '',
            error: '',
        }
    },

    computed:{

        isAddressEncrypted(){
            return Number.parseInt(this.address.keys.private.encryption) === 2;
        },

        isWalletEncrypted() {
            return this.$store.state.encrypted;
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

            if (extension === "wallet") {
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
            } else {
                this.$notify({
                    type: 'error',
                    title: `Import Error`,
                    text: `File not supported. Maybe wrong file? `,
                });
            }


        },

        async process(){

            this.$store.commit('setIsLoading', true);

            this.error = '';

            const checkPassword = await global.apacache.wallet.encryption.checkPassword(this.walletPassword);
            if (!checkPassword)
                this.error = "Your wallet password is invalid";


            try{

                const out = await global.apacache.wallet.manager.importJSON( JSON.parse(this.addressData), this.addressPassword );
                console.log("out", out);

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


    .btn{
        display: inline-block;
        text-align: center;
    }

    .importAddresses {
        position: fixed;
        top: -1000px;
    }

    .importAccountText{
        cursor: pointer;
    }

</style>