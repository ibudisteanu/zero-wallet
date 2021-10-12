<template>

    <modal ref="modal" title="Import Private Key" content-class="">

        <template slot="body">

            <wizzard :titles="[
                {icon: 'fas fa-pencil-alt', name: 'Information', tooltip: 'Information of the account' },
                {icon: 'fas fa-file-code', name: 'Private Key', tooltip: 'Private Key' },
                {icon: 'fas fa-check', name: 'Done', tooltip: 'Finish importing account' }]"
                     @setTab="setTab" controls-class-name="modal-footer bg-light" :buttons="buttons" >

                <template slot="tab_0">
                    <label>Account Name</label>
                    <input type="text" class="form-control" v-model="name"></input>
                </template>

                <template slot="tab_1">
                    <label>Private Key</label>
                    <textarea class="form-control" rows="3" v-model="privateKey"></textarea>
                </template>

            </wizzard>

        </template>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import UtilsHelper from "src/utils/utils-helper";
import Wizzard from "src/components/utils/wizzard"

export default {

    components: {PasswordInput, Modal, Wizzard },

    data(){
        return {
            privateKey: '',
            name: '',
        }
    },

    computed:{
        buttons(){
            return { 1: {
                icon: 'fa fa-file-upload', text: 'Import Account'
            }}
        }
    },

    methods:{

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === 1 && value === 2)
                    await this.handleImportPrivateKey()

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },

        showModal() {
            Object.assign(this.$data, this.$options.data());
            return this.$refs.modal.showModal();
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        async handleImportPrivateKey(){

            try{

                if (this.privateKey.length !== 64) throw "Private key must be 64 hex numbers"

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                this.$store.state.page.refLoadingModal.showModal();

                await UtilsHelper.sleep(50 )

                const out = await PandoraPay.wallet.manager.importWalletPrivateKey( password, this.privateKey, this.name, this.selectedType );
                if (!out) throw "Your address already exists!"

                await this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Imported successfully`,
                    text: `Your Address has been successfully imported.`,
                });

                this.closeModal();

            }catch(err){
                throw err
            }finally{
                this.$store.state.page.refLoadingModal.closeModal();
            }

        },

    },

}
</script>

<style scoped>

</style>
