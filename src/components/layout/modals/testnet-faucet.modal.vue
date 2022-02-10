<template>
    <modal ref="modal" title="Faucet coins" :close-button="loaded" >

        <template v-slot:body v-if="walletAddress">
            <div class="pb-4">
                <label class="pb-2">Receive your testnet coins to this address:</label>
                <div class="address align-items-center">
                    <account-identicon :address="walletAddress.addressEncoded" size="35" outer-size="13" />
                    <span class="text-break fw-bold">{{ $store.getters.addressDisplay(this.walletAddress) }}</span>
                </div>
            </div>
            <div class="text-center">
                <template v-if="!hCaptchaSiteKey">
                    <loading-spinner />
                </template>
                <template v-else>
                    <vue-hcaptcha :sitekey="hCaptchaSiteKey" @verify="handleCaptchaToken" :theme="`${$store.state.settings.dark ? 'dark' : 'light'}`" />
                </template>
            </div>
        </template>

        <template v-slot:footer>
            <alert-box v-if="error" class="w-100" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''">{{error}}</alert-box>

            <loading-button :text="`Receive ${$store.state.faucet.faucetTestnetCoins}`" @submit="handleSubmit" icon="fas fa-coins" :disabled="!captchaToken" />

            <button :class="`btn btn-falcon-${loaded ? 'primary':'secondary'}`" type="button" @click="closeModal">
                <i class="fas fa-ban"></i> Cancel
            </button>

        </template>


    </modal>
</template>

<script>
import Modal from "src/components/utils/modal"
import AccountIdenticon from "../../wallet/account/account-identicon";
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import AlertBox from "src/components/utils/alert-box"
import LoadingSpinner from "src/components/utils/loading-spinner";
import LoadingButton from "src/components/utils/loading-button"
export default {

    components: {AccountIdenticon, Modal, VueHcaptcha, AlertBox, LoadingSpinner, LoadingButton},

    data(){
        return{
            captchaToken: "",
            error: "",
            loaded: true,
        }
    },

    computed:{
        walletAddress(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey] ;
        },
        hCaptchaSiteKey(){
            return this.$store.state.faucet.hCaptchaSiteKey
        }
    },

    methods:{

        async showModal() {

            Object.assign(this.$data, this.$options.data());
            const promise = this.$refs.modal.showModal()

            this.$store.state.blockchain.syncPromise.then( async ()=>{
                await this.$store.dispatch('initializeFaucetInfo')
            })

            return promise
        },

        closeModal() {
            if (!this.loaded) return
            return this.$refs.modal.closeModal();
        },

        handleCaptchaToken(token){
            this.captchaToken = token
        },

        async handleSubmit(resolver){
            try{
                this.error = ""
                this.loaded = false

                await this.$store.state.blockchain.syncPromise;

                const hash = await PandoraPay.network.getNetworkFaucetCoins( this.$store.getters.addressDisplay(this.walletAddress), this.captchaToken )
                if (!hash || hash.length !== 64) throw "hash was not received"

                this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Faucet created a Tx`,
                    text: `The faucet created a transaction ${hash}`,
                });

                this.$router.push('/explorer/tx/'+hash)

                return this.$refs.modal.closeModal();

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
        grid-template-columns: 60px 1fr;
        grid-column-gap: 10px;
    }
</style>
