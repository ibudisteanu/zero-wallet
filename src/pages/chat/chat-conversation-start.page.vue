<template>

    <layout>

        <chat-top-bar/>

        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Start Encrypted End to End Conversation</h1>

                    <span class="disabled">Public Key</span> <br/>

                    <div :class="`${destinationIdenticon ? 'destination-': ''}row`">

                        <account-identicon v-if="destinationIdenticon" :identicon="destinationIdenticon" size="35" outer-size="8" />

                        <div class="input-toggle-group">
                            <input type="text" v-model="publicKey">
                            <i class="fa fa-qrcode input-toggle" @click="qrCodeScanner"></i>
                        </div>

                    </div>

                    <div class="pd-top-20">
                        <loading-button text="Start conversation" @submit="handleStartConversation" icon="fa fa-comments"  :disabled="!destinationIdenticon  || !!validation" />
                    </div>

                    <qr-code-scanner ref="refQRCodeScannerModal"/>

                </div>

            </div>

        </div>

    </layout>
</template>

<script>

import Layout from "src/components/layout/layout"
import AccountIdenticon from "src/components/wallet/account/account-identicon"
import QrCodeScanner from "src/components/utils/qr-code-scanner/qr-code-scanner";
import Consensus from "src/consensus/consensus"
import ChatTopBar from "./common/chat-top-bar"
import LoadingButton from "src/components/utils/loading-button.vue"

export default {

    components: {Layout, AccountIdenticon, QrCodeScanner, ChatTopBar, LoadingButton },

    data(){
        return {

            publicKey: '',

            error: '',
        }
    },

    methods:{

        qrCodeScanner(){
            this.$refs.refQRCodeScannerModal.showModal();
        },

        handleStartConversation(resolve){

            try{
                this.$router.push('/chat/conversation/'+this.publicKey);
            }finally{
                resolve(true);
            }

        }

    },

    computed:{


        validation(){

            if (!this.publicKey) return '';

            try{

                if (this.publicKey.length !== 66) throw {message: "Public Keys are 66 bytes"};

                const address = PandoraPay.cryptography.addressGenerator.generateAddressFromPublicKey( this.publicKey );
                if (!address) throw {message: "Invalid address"};

                return '';

            }catch(err){
                return err.message;
            }
        },

        destinationIdenticon(){

            try{

                if (this.publicKey.length !== 66) throw {message: "Public Keys are 66 bytes"};

                const address = PandoraPay.cryptography.addressGenerator.generateAddressFromPublicKey( this.publicKey );
                if (!address) throw {message: "Invalid address"};

                return address.identiconImg();

            }catch(err){

            }

        },

    },


}

</script>

<style scoped>

    .destination-row{
        display: grid;
        grid-template-columns: 50px 1fr;
        grid-column-gap: 10px;
    }

</style>