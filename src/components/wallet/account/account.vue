<template>
    <div v-if="address">
        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">{{title}} {{walletAddress ? walletAddress.name : ''}}</h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="row g-0 align-items-center py-2 position-relative">
                    <div class="col px-1 py-1 position-static">
                        <div class="d-flex align-items-center d-block p-2">
                            <div :class="`avatar avatar-xxl me-sm-3 me-2`">
                                <account-identicon :public-key="address.publicKey" :size="$store.state.settings.mobile ? 36 : 56" :outer-size="$store.state.settings.mobile ? 8 : 20" />
                            </div>
                            <span class="fw-bold d-block text-break">
                                {{ getAddress }}
                                <i class="fas fa-copy cursor-pointer " @click="copyAddress" v-tooltip.bottom="'Copy Address'"  ></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="p-3" v-if="account && account.plainAccount">
                    <small class="fs--1 text-700">
                        Nonce: {{account.plainAccount.nonce}}
                    </small>
                </div>
                <div class="p-3" v-if="account && account.registration">
                  <div>
                    <small class="fs--1 text-700"> Staked: {{account.registration.staked ? 'Yes': 'No'}} </small>
                  </div>
                  <div>
                    <small class="fs--1 text-700"> Spend Public Key: {{account.registration.spendPublicKey}} </small>
                  </div>
                </div>
                <div class="card-footer bg-light g-0 d-block p-3">
                    <loading-button :submit="showAccountQRCode" text="" icon="fas fa-qrcode" class-custom="btn btn-falcon-default rounded-pill me-1 mb-1 cursor-pointer" tooltip="Show Address QR Code" />
                    <loading-button :submit="showGenerateCustomAddress" text="" icon="fas fa-tools" class-custom="btn btn-falcon-default rounded-pill me-1 mb-1 cursor-pointer" tooltip="Generate custom address" />
                    <loading-button :submit="showAddressJSON" text="" icon="fas fa-file" class-custom="btn btn-falcon-default rounded-pill me-1 mb-1 cursor-pointer" tooltip="Show JSON address" />
                    <loading-button :disabled="!account || !account.registration || !account.registration.staked" :submit="showShareStaked" text="" icon="fas fa-piggy-bank" class-custom="btn btn-falcon-default rounded-pill me-1 mb-1 cursor-pointer" tooltip="Share staked address with a delegator node" />
                </div>
            </div>
        </div>

        <account-generate-custom-address-modal ref="refGenerateCustomAddressModal"/>
        <shared-staked-delegator-node-modal ref="refSharedStakedDelegatorNodeModal"/>

    </div>
</template>

<script>

import AccountIdenticon from "./account-identicon";
import AccountGenerateCustomAddressModal from "./account-generate-custom-address.modal"
import LoadingButton from "src/components/utils/loading-button";
import SharedStakedDelegatorNodeModal from "src/components/staking/shared-staked-delegator-node.modal"
const {version} = PandoraPay.enums.wallet.address;

export default {

    components: { AccountGenerateCustomAddressModal, AccountIdenticon, LoadingButton, SharedStakedDelegatorNodeModal },

    props: {
        address: {default: null},
        title: {default: "Account details"},
    },

    computed:{
        account(){
            return this.$store.state.accounts.list[this.address.publicKey]
        },
        getAddress(){
            return this.$store.getters.addressDisplay(this.address)
        },
        walletAddress(){
            return this.$store.state.wallet.addresses[this.address.publicKey]
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

        showGenerateCustomAddress(){
            return this.$refs.refGenerateCustomAddressModal.showModal(this.address);
        },

        showAccountQRCode(){
            return this.$store.state.page.QRCodeModal.showModal(this.getAddress, this.address.name || '');
        },

        showAddressJSON(){
          return this.$store.state.page.inputModal.showModal({ title:"ADDRESS JSON", data: JSONStringify(this.account, null, 2),
            textarea: { allowEdit:false, class:"form-control-sm fs--2" }, button: null })
        },

        showShareStaked(){
          return this.$refs.refSharedStakedDelegatorNodeModal.showModal(this.address.publicKey)
        },

        sendFunds(){
            this.$router.push('/txs/private/send')
        },

    },

}
</script>

<style scoped>

</style>
