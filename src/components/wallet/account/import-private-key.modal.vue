<template>

    <modal ref="modal" title="Import Private Key" content-class="">

        <template slot="body">

            <div class="theme-wizard">
                <div class="card-header bg-light pt-0 pb-2">
                    <ul class="nav justify-content-between nav-wizard">
                        <li class="nav-item">
                            <router-link :class="`nav-link ${tab===0?'active':''} fw-semi-bold`" to="#" @click.native="()=>setTab(0)">
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-key"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Type of Account</span>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :class="`nav-link ${tab===1?'active':''} fw-semi-bold`" to="#" @click.native="()=>setTab(1)">
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-pencil-alt"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Information</span>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :class="`nav-link ${tab===2?'active':''} ${name ? '':'disabled'} fw-semi-bold`" to="#" @click.native="()=>name ? setTab(2) : false">
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-file-code"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Private Key</span>
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
                            <div class="form-check">
                                <input class="form-check-input" id="transparentAddress" type="radio" value="transparentAddress" v-model="addressType" />
                                <label class="form-check-label" for="transparentAddress">Transparent Address</label>
                            </div>
                        </div>
                        <div :class="`tab-pane ${tab===1?'active':''} `">
                            <label>Account Name</label>
                            <input type="text" class="form-control" v-model="name"></input>
                        </div>
                        <div :class="`tab-pane ${tab===2?'active':''}`">
                            <label>Private Key</label>
                            <textarea class="form-control" rows="3" v-model="privateKey"></textarea>
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
            <loading-button v-if="tab===2" text="Import Private Key" @submit="importPrivateKey" icon="fa fa-file-upload"  />
        </template>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import AlertBox from "src/components/utils/alert-box"
import UtilsHelper from "src/utils/utils-helper";

export default {

    components: {PasswordInput, Modal, LoadingButton, AlertBox },

    data(){
        return {
            addressType: "transparentAddress",
            privateKey: '',
            name: '',
            error: '',
            tab: 0,
        }
    },

    computed:{

    },

    methods:{

        showModal() {
            Object.assign(this.$data, this.$options.data());
            return this.$refs.modal.showModal();
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        handleBack(){
            return this.increaseTab(-1)
        },
        handleNext(){
            if (this.tab === 1 && !this.name){
                return this.error = "Specify a name for the new account"
            }
            return this.increaseTab(1)
        },

        increaseTab(value){
            this.tab = this.tab + value
            if (this.tab === 3) this.importPrivateKey()
        },
        setTab(value){
            this.tab = value
            if (this.tab === 3) this.importPrivateKey()
        },

        async importPrivateKey(resolve){

            try{

                this.error = ""

                if (this.privateKey.length !== 64) throw Error("Private key must be 64 hex numbers");

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                this.$store.state.page.refLoadingModal.showModal();

                await UtilsHelper.sleep(50 )

                const out = await PandoraPay.wallet.manager.importWalletPrivateKey( password, this.privateKey, this.name, this.selectedType );

                if (!out)
                    throw "Your address already exists!"

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
                resolve(true);
            }

        },

    },

}
</script>

<style scoped>

</style>
