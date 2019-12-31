<template>
    <modal ref="modal" title="Import Address" >

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


            <div v-if="isAddressEncrypted">
                <span class="disabled">Address password</span> <br/>
                <password-input v-model="addressPassword"></password-input>
            </div>

            <div v-if="isWalletEncrypted">
                <span class="disabled">Wallet password</span> <br/>
                <password-input v-model="walletPassword"></password-input>
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
            addressPassword: '',
            walletPassword: '',
        }
    },

    computed:{

        isAddressEncrypted(){
            return this.address.keys.encryption === 2;
        },

        isWalletEncrypted() {
            return this.$store.state.encrypted;
        },

    },

    methods:{

        showModal() {
            this.$refs.modal.showModal();
        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        importAccount(){

            this.$refs.refImportedAddresses.click();

        },

        handleImportAccounts(){


            if ((window.File && window.FileReader && window.FileList && window.Blob) === false){
                Notification.addAlert(undefined, "error", "Import Error", "The File import is not fully supported in this browser", 5000);
                return;
            }

            console.log(this.$refs.refImportedAddresses);

            const file = this.$refs.refImportedAddresses.files[0];

            if (!file){
                Notification.addAlert(undefined, "error", "Import Error", "No file selected", 5000);
                return;
            }


            let extension = file.name.split('.').pop();

            if (extension === "wallet") {
                let reader = new FileReader();

                try {
                    reader.onload = async (e) => {

                        let data = JSON.parse(reader.result);

                        console.log("data", data);
                        this.address = data;


                    }

                } catch (exception){
                    Notification.addAlert(undefined, "error", "Import Error","Your Uploaded file is not a valid JSON format", 5000);
                }

                reader.readAsText(file);
            } else {
                Notification.addAlert(undefined, "error","Import Error", "File not supported!", 5000);
            }


        },

        async process(){

            const out = await global.apacache.wallet.manager.importJSON(data);

            console.log("out", out);

            // if (answer.result === true){
            //     Notification.addAlert(undefined, "success", "Import Success", answer.address + " has been imported!", 5000);
            // } else {
            //     Notification.addAlert(undefined, "error", "Import Error", answer.message, 5000);
            // }

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