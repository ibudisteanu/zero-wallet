<template>
    <modal ref="modal" title="Faucet coins" >

        <div class="card-body pb-0 pt-2">
            <div class="tab-content">
                <div class="pb-4">
                    <label>Receive your coins to this address:</label>
                    <div class="address d-flex align-items-center">
                        <account-identicon :address="address.addressEncoded" :size="30" :outer-size="5" />
                        <span class="text-break">{{address.addressEncoded}}</span>
                    </div>
                </div>
                <div class="pb-4">
                    <vue-hcaptcha :sitekey="$store.state.faucet.hCaptchaSiteKey" @verify="handleCaptchaAnswer" :theme="`${$store.state.page.dark ? 'dark' : 'light'}`" />
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" type="button" @click="" :disabled="!captchaAnswer">
                        Receive {{$store.state.faucet.faucetTestnetCoins}} <i class="fa fa-coins"></i>
                    </button>
                </div>
            </div>
        </div>

    </modal>
</template>

<script>
import Modal from "src/components/utils/modal"
import AccountIdenticon from "../../wallet/account/account-identicon";
import VueHcaptcha from '@hcaptcha/vue-hcaptcha';

export default {

    components: {AccountIdenticon, Modal, VueHcaptcha},

    data(){
        return{
            captchaAnswer: ""
        }
    },

    computed:{
        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKeyHash] ;
        }
    },

    methods:{

        handleCaptchaAnswer(answer){
            this.captchaAnswer = answer
        },

        showModal() {
            Object.assign(this.$data, this.$options.data());
            this.$refs.modal.showModal();
        },

        closeModal() {
            this.$refs.modal.closeModal();
        },
    },

}
</script>

<style scoped>
    .address{
        display: grid;
        grid-template-columns: 30px 1fr;
        grid-column-gap: 10px;
    }
</style>
