<template>
    <div v-if="address">
        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Account Details</h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="row g-0 align-items-center py-2 position-relative border-bottom border-200">
                    <div class="col ps-card py-1 position-static">
                        <div class="d-flex align-items-center d-block">
                            <div class="avatar avatar-xxl me-3">
                                <account-identicon :public-key-hash="address.publicKeyHash" :size="60" :outer-size="20" :version="address.version" />
                            </div>
                            <span class="fw-bold d-block text-break">
                                {{address.addressEncoded}}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="g-0 d-block-inline p-3">

                    <button class="btn btn-falcon-default rounded-pill me-1 mb-1" type="button" @click="copyAddress" v-tooltip.bottom="'Copy Address'" >
                        <i class="fa fa-copy pointer" />
                    </button>

                    <button class="btn btn-falcon-default rounded-pill me-1 mb-1" type="button" @click="showAccountQRCode" v-tooltip.bottom="'Show Address QR Code'">
                        <i class="fa fa-qrcode pointer" />
                    </button>

                    <button class="btn btn-falcon-default rounded-pill me-1 mb-1" type="button" @click="createCustomAddress"  v-tooltip.bottom="'Create custom address'">
                        <i class="fa fa-tools pointer" />
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
    },

    computed:{
        getAddress(){
            return this.address.addressEncoded;
        },
    },

    methods: {
        copyAddress(){

            this.$copyText(this.getAddress).then( e =>
                this.$notify({
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `Address ${this.getAddress} copied to clipboard`,
                }),
                e =>
                this.$notify({
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
        }

    },

}
</script>

<style scoped>

</style>
