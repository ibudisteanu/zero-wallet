<template>
    <div v-if="account">
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
                                <account-identicon :public-key-hash="account.publicKeyHash" :size="60" :outer-size="20" :version="account.version" />
                            </div>
                            <span class="fw-bold d-block text-truncate">
                                {{account.addressEncoded}}
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

        <div v-if="!isLoading && !isFound" class="alert alert-warning border-2 d-flex align-items-center" role="alert">
            <div class="bg-white me-3 icon-item"><i class="fa fa-exclamation-triangle"></i></div>
            <p class="mb-0 flex-1">Address doesn't exist!</p>
        </div>

        <account-qr-code-modal ref="refAccountQRCodeModal"/>
        <account-generate-custom-address ref="refGenerateCustomAddress"/>

    </div>
</template>

<script>

import AccountIdenticon from "./account-identicon";
import AccountQRCodeModal from "./account-qr-code.modal"
import AccountGenerateCustomAddress from "./account-generate-custom-address.modal"
const {version} = PandoraPay.enums.wallet.address;

export default {

    components: { AccountGenerateCustomAddress, AccountIdenticon, 'accountQrCodeModal': AccountQRCodeModal,  },

    props: {
        account: {default: null},
    },

    computed:{

        getAddress(){
            return this.account.addressEncoded;
        },

        isLoading(){
            return this.account === undefined
        },
        isFound(){
            return this.account !== null
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
            this.$refs.refGenerateCustomAddress.showModal(this.account);
        },

        showAccountQRCode(){
            this.$refs.refAccountQRCodeModal.showModal(this.getAddress, this.account.name || '');
        }

    },

}
</script>

<style scoped>

</style>
