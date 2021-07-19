<template>

    <modal ref="modal" title="Import Account" content-class="" >

        <template slot="body">

            <div class="theme-wizard">
                <div class="card-header bg-light pt-0 pb-2">
                    <ul class="nav justify-content-between nav-wizard">
                        <li class="nav-item">
                            <router-link :class="`nav-link ${tab===0?'active':''} fw-semi-bold`" to="#" @click.native="()=>setTab(0)">
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-file"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">File</span>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :class="`nav-link ${tab===1?'active':''} ${address ? '' : 'disabled'} fw-semi-bold`" to="#" @click.native="()=>address ? setTab(1) : false">
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-wallet"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Account</span>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :class="`nav-link ${tab===2?'active':''} ${ (address && isAddressEncrypted) ? '' : 'disabled' } fw-semi-bold`" to="#" @click.native="()=>(address && isAddressEncrypted) ? setTab(2) : false">
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-lock"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Encryption</span>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :class="`nav-link ${tab===3?'active':''} disabled fw-semi-bold`" to="#">
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-check"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Finish</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="card-body py-3">
                    <div class="tab-content">
                        <div :class="`tab-pane ${tab===0?'active':''} `">
                            <div class="mb-3">
                                <label class="form-label" for="selectFile">Select .pandora file</label>
                                <input class="form-control" id="selectFile" type="file" v-on:change="handleImportAccounts" size="1" accept=".pandora" ref="refImportedAddresses" />
                            </div>
                        </div>
                        <div :class="`tab-pane ${tab===1?'active':''} `" v-if="address">
                            <div class="mb-3">
                                <label class="form-label">Name {{address.name}}</label>
                                <label class="form-label">Address {{address.addressEncoded}}</label>
                            </div>
                        </div>
                        <div :class="`tab-pane ${tab===2?'active':''} `">
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <password-input v-model="addressPassword" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </template>

        <template slot="footer">
            <alert-box v-if="error" class="w-100" type="error">{{error}}</alert-box>

            <button class="btn btn-link" type="button" v-if="tab > 0" @click="handleBack">
                Back <i class="fas fa-chevron-left me-2" data-fa-transform="shrink-3"></i>
            </button>
            <button class="btn btn-falcon-primary" type="button" v-if="tab < 2" @click="handleNext">
                <i class="fas fa-chevron-right ms-2" data-fa-transform="shrink-3"> </i> Next
            </button>
        </template>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import LoadingButton from "src/components/utils/loading-button.vue"
import UtilsHelper from "src/utils/utils-helper";
import AlertBox from "src/components/utils/alert-box"
import PasswordInput from "src/components/utils/password-input";

export default {

    components: {PasswordInput, Modal, LoadingButton, AlertBox, PasswordInput },

    data(){
        return {
            address: null,
            addressData: '',
            addressPassword: '',
            error: '',
            tab: 0,
        }
    },

    computed:{

        isAddressEncrypted(){
            return false;
        },

    },

    methods:{

        showModal() {
            Object.assign(this.$data, this.$options.data());
            return this.$refs.modal.showModal();
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        increaseTab(value){
            this.tab = this.tab + value
        },
        setTab(value){
            this.tab = value
        },

        handleBack(){
            if (this.tab === 3) return this.setTab(1)
            return this.increaseTab(-1)
        },

        async handleNext(){
            if (this.tab === 0){
                await this.handleImportAccounts()
                return this.setTab(1)
            }
            if (this.tab === 1){
                await this.handleProcess()
                return this.setTab(3)
            }
            return this.increaseTab(1)
        },

        handleImportAccounts(){

            try{
                this.error = ""
                this.address = null
                this.addressData = ""

                if ((window.File && window.FileReader && window.FileList && window.Blob) === false)
                    throw `Your browser/device doesn't support file import.`


                const file = this.$refs.refImportedAddresses.files[0];

                if (!file) throw `No file selected.`

                let extension = file.name.split('.').pop();

                if (extension !== "pandora") throw `File not supported. Maybe wrong file? `

                const reader = new FileReader();

                reader.onload = async (e) => {

                    const data = JSON.parse(reader.result);

                    this.address = data;
                    this.addressData = reader.result;

                }

                reader.readAsText(file);

            }catch(err){
                this.error = err.toString()
            }

        },

        async handleProcess(resolve){

            try{

                this.error = ""

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                this.$store.state.page.refLoadingModal.showModal();

                await UtilsHelper.sleep(50 )

                const out = await PandoraPay.wallet.manager.importWalletAddressJSON( password, this.addressData, this.addressPassword );

                if (!out)
                    throw `Your address already exists`

                this.$notify({
                    type: 'success',
                    title: `Imported successfully`,
                    text: `Your Address has been successfully imported.`,
                });

                this.closeModal();

            }catch(err){
                this.error = err.toString()
            }finally{
                this.$store.state.page.refLoadingModal.closeModal();
                if (resolve)
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
