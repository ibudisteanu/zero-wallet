<template>
    <div v-if="address">
        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">{{title}}</h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="row g-0 align-items-center py-2 position-relative border-bottom border-200">
                    <div class="col px-1 py-1 position-static">
                        <div class="d-flex align-items-center d-block">
                            <div class="avatar avatar-xxl me-3">
                                <account-identicon :public-key-hash="address.publicKeyHash" :size="60" :outer-size="20" :version="address.version" />
                            </div>
                            <span class="fw-bold d-block text-break">
                                {{address.addressEncoded}}
                                <i class="fa fa-copy pointer" @click="copyAddress" v-tooltip.bottom="'Copy Address'"  ></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="p-3" v-if="account">
                    <small class="fs--1 text-700">
                        Nonce: {{account.nonce}}
                    </small>
                </div>
                <div class="card-footer bg-light g-0 d-block-inline p-3">

                    <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer" type="button" @click="showAccountQRCode" v-tooltip.bottom="'Show Address QR Code'">
                        <i class="fa fa-qrcode" />
                    </button>

                    <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer" type="button" @click="createCustomAddress"  v-tooltip.bottom="'Create custom address'">
                        <i class="fa fa-tools" />
                    </button>

                    <button v-if="$store.getters.walletContains(this.address.publicKeyHash)" class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer" type="button" @click="sendFunds"  v-tooltip.bottom="'Send Transparently Funds'">
                        <i class="fa fa-money-check-alt" />
                    </button>

                </div>
            </div>
        </div>

        <account-generate-custom-address ref="refGenerateCustomAddress"/>

    </div>
</template>

<script>

import AccountIdenticon from "./account-identicon";
import AccountGenerateCustomAddress from "./account-generate-custom-address.modal"
const {version} = PandoraPay.enums.wallet.address;

export default {

    components: { AccountGenerateCustomAddress, AccountIdenticon },

    props: {
        address: {default: null},
        title: {default: "Account details"},
    },

    computed:{
        account(){
            return this.$store.state.accounts.list[this.address.publicKeyHash]
        },

        getAddress(){
            return this.address.addressEncoded;
        },
    },

    methods: {
        copyAddress(){

            this.$copyText(this.getAddress).then(
                e => this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `Address ${this.getAddress} copied to clipboard`,
                }),
                e => this.$store.dispatch('addToast', {
                    type: 'error',
                    title: `Clipboard failed`,
                    text: `Failed to copy to clipboard`,
                })
            )

        },

        createCustomAddress(){
            return this.$refs.refGenerateCustomAddress.showModal(this.address);
        },

        showAccountQRCode(){
            return this.$store.state.page.refQRCodeModal.showModal(this.getAddress, this.address.name || '');
        },

        sendFunds(){
            this.$router.push('/send/transparent')
        },

    },

}
</script>

<style scoped>

</style>
