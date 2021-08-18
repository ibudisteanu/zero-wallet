<template>
    <modal ref="modal" title="Faucet coins" >

        <template slot="body" v-if="address">
            <div class="pb-4">
                <label class="pb-2">Receive your coins to this address:</label>
                <div class="address align-items-center">
                    <account-identicon :address="address.addressEncoded" :size="30" :outer-size="10" />
                    <span class="text-break">{{address.addressEncoded}}</span>
                </div>
            </div>
            <div class="text-center">
                <template v-if="!hCaptchaSiteKey">
                    <loading-spinner />
                </template>
                <template v-else>
                    <vue-hcaptcha :sitekey="hCaptchaSiteKey" @verify="handleCaptchaToken" :theme="`${$store.state.page.dark ? 'dark' : 'light'}`" />
                </template>
            </div>
        </template>

        <template slot="footer">
            <alert-box v-if="error" class="w-100" type="error">{{error}}</alert-box>

            <loading-button :text="`Receive ${$store.state.faucet.faucetTestnetCoins}`" @submit="handleSubmit" icon="fa fa-coins" :disabled="!captchaToken" />

            <button class="btn btn-falcon-secondary" type="button" @click="closeModal">
                <i class="fa fa-ban"></i> Cancel
            </button>

        </template>


    </modal>
</template>

<script>
import Modal from "src/components/utils/modal"
import AccountIdenticon from "../../wallet/account/account-identicon";
import VueHcaptcha from '@hcaptcha/vue-hcaptcha';
import AlertBox from "src/components/utils/alert-box"
import LoadingSpinner from "src/components/utils/loading-spinner";
import LoadingButton from "src/components/utils/loading-button.vue"
export default {

    components: {AccountIdenticon, Modal, VueHcaptcha, AlertBox, LoadingSpinner, LoadingButton},

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

        async showModal() {
            Object.assign(this.$data, this.$options.data());

            await this.$store.state.blockchain.syncPromise;

            return this.$refs.modal.showModal();
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        handleCaptchaToken(token){
            this.captchaToken = token
        },

        async handleSubmit(resolver){
            try{
                this.error = ""
                this.loaded = false

                const hash = await PandoraPay.network.getNetworkFaucetCoins( this.address.addressEncoded, this.captchaToken )
                if (!hash || hash.length !== 64) throw "hash was not received"

                await this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Faucet created a Tx`,
                    text: `The faucet created a transaction ${hash}`,
                });

                this.$router.push('/explorer/tx/'+hash)

                this.closeModal()

            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
                resolver()
            }
        }

    },

}
</script>

<style scoped>
    .address{
        display: grid;
        grid-template-columns: 50px 1fr;
        grid-column-gap: 10px;
    }
</style>
