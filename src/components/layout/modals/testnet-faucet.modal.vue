<template>
    <modal ref="modal" title="Faucet coins" >

        <div class="card-body pb-0 pt-2">
            <div class="tab-content" v-if="address">
                <div class="pb-4">
                    <label>Receive your coins to this address:</label>
                    <div class="address d-flex align-items-center">
                        <account-identicon :address="address.addressEncoded" :size="30" :outer-size="5" />
                        <span class="text-break">{{address.addressEncoded}}</span>
                    </div>
                </div>
                <div class="pb-4 text-center">
                    <template v-if="!hCaptchaSiteKey">
                        <loading-spinner />
                    </template>
                    <template v-else>
                        <vue-hcaptcha :sitekey="hCaptchaSiteKey" @verify="handleCaptchaToken" :theme="`${$store.state.page.dark ? 'dark' : 'light'}`" />
                    </template>
                </div>
                <alert-box v-if="error" type="error">{{error}}</alert-box>
                <div class="modal-footer">
                    <button class="btn btn-primary" type="button" @click="handleSubmit" :disabled="!captchaToken">
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
import AlertBox from "src/components/utils/alert-box"
import LoadingSpinner from "src/components/utils/loading-spinner";
export default {

    components: {AccountIdenticon, Modal, VueHcaptcha, AlertBox, LoadingSpinner},

    data(){
        return{
            captchaToken: "",
            error: "",
            loaded: false,
        }
    },

    computed:{
        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKeyHash] ;
        },
        hCaptchaSiteKey(){
            return this.$store.state.faucet.hCaptchaSiteKey
        }
    },

    methods:{

        showModal() {
            Object.assign(this.$data, this.$options.data());
            return this.$refs.modal.showModal();
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        handleCaptchaToken(token){
            this.captchaToken = token
        },

        async handleSubmit(){
            try{
                this.error = ""
                this.loaded = false

                const hash = await PandoraPay.network.getNetworkFaucetCoins( this.address.addressEncoded, this.captchaToken )
                if (!hash || hash.length !== 64) throw "hash was not received"

                this.$router.push('/explorer/tx/'+hash)

            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
            }
        }

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
