<template>

    <div>

        <span v-if="error" class="centered danger">
            {{error}}
        </span>
        <div class="msger-inputarea">

            <div class="row">
                <div class="col-xs-10">
                    <input type="text" class="msger-input" placeholder="Your message..." v-model="text" v-on:keyup="keyUp" >
                </div>
                <div class="col-xs-2">
                    <loading-button @submit="handleSendMessage" icon="fa fa-paper-plane" text="Send"/>
                </div>
            </div>
            <div class="row">
                <div v-if="!attachment">
                    <i v-if="!attachmentLoading" class="fa fa-paperclip pointer" @click="handleOpenFileDialog"/>
                    <loading-spinner v-else />
                </div>
                <div v-else>
                    <chat-attachment :attachment="attachment" :allowDelete="true" @deleteAttachment="handleDeleteAttachment" />
                </div>
            </div>
        </div>

        <captcha-modal ref="refCaptchaModal" />

        <input type="file" class="file" ref="refFile" @change="handleFileSelected" />

    </div>

</template>

<script>

import Chat from "src/chat/chat"
import LoadingButton from "src/components/utils/loading-button.vue"
import CaptchaModal from "src/components/utils/captcha/captcha.modal.vue"
import LoadingSpinner from "src/components/utils/loading-spinner";
import ChatAttachment from "./../common/chat-attachment.vue"

export default {

    components: {LoadingButton, CaptchaModal, LoadingSpinner, ChatAttachment},

    props:{
        senderAddress: {default: ''},
        senderPublicKey: {default: ''},
        receiverPublicKey: {default: ''},
    },

    data(){
        return {
            text: '',
            error: '',
            attachmentLoading: false,
            attachment: null,
        }
    },

    computed:{

        count(){
            return (this.$store.state.chatMessages.conversationMessages[ this.publicKeys[0] + ':'+ this.publicKeys[1] ] || {}).count
        },

        publicKeys(){
            return [ this.senderPublicKey , this.receiverPublicKey ].sort( (a,b) => a.localeCompare(b) );

        },

    },

    methods:{

        handleDeleteAttachment(){

            this.attachmentLoading = false;
            this.attachment = null;
            this.$refs.refFile.value = '';

        },

        async handleFileSelected(){

            this.error = '';

            const file = this.$refs.refFile.files[0];
            console.log("file", file);

            if (file){

                if (file.size > PandoraPay.argv.encryptedMessage.maxSize){
                    this.error = 'File selected is too big';
                    return false;
                }

                this.attachmentLoading = true;

                const obj = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                };

                const reader = new FileReader();

                reader.onload = () => {
                    const data = reader.result;
                    const buffer = Buffer.from(data);
                    obj.data = buffer;

                    this.attachmentLoading = false;
                    this.attachment = obj;
                };

                // Read in the image file as a data URL.
                reader.readAsArrayBuffer(file);

            }
        },

        async handleOpenFileDialog(){

            if (!window.File || !window.FileReader || !window.FileList || !window.Blob)
                return alert('The File APIs are not fully supported in this browser.');

            this.$refs.refFile.click();


        },

        async handleSendMessage(resolve, captcha){

            this.error = '';

            try{

                if (this.text.length < 1) throw {message: "Text needs at least one char"};

                let data;
                if (this.attachment)
                    data = {
                        script: 1,
                        version: 0,
                        data: {
                            version: 0,
                            text: this.text,
                            name: this.attachment.name,
                            type: this.attachment.type,
                            data: this.attachment.data,
                        }
                    };
                else
                    data = {
                        script: 0,
                        data: this.text,
                    };


                let encryptedMessage;

                try{

                    const out = await PandoraPay.cryptography.encryptedMessageCreator.createEncryptedMessage({
                        senderPublicKey: this.senderPublicKey,
                        receiverPublicKey: this.receiverPublicKey,
                        data,
                    });

                    encryptedMessage = out.encryptedMessage;

                }catch(err){
                    this.error = 'Data is to big';
                    return;
                }


                const senderWalletAddress = PandoraPay.wallet.manager.getWalletAddressByAddress( this.senderAddress, false, this.password );

                encryptedMessage.signEncryptedMessage( senderWalletAddress.decryptPrivateKey() );

                const out = await Chat._client.emitAsync("encrypted-chat/new-message", { encryptedMessage: encryptedMessage.toBuffer(), captcha: captcha }, 0);

                console.log("out", out);

                if (!out) throw {message: "Message was not included"};

                if (out.result === false) {

                    if (out.error === "Captcha is missing") {

                        this.$refs.refCaptchaModal.showModal(this.handleSendMessage);
                        return resolve(false);
                    }

                    if ( this.$refs.refCaptchaModal.processError(out.error) === '')
                        return resolve(false);
                    else{
                        return resolve(false);
                    }

                } else {

                    if (captcha){
                        this.$refs.refCaptchaModal.reset();
                        this.$refs.refCaptchaModal.closeModal();
                    }

                }

                //await this.$store.commit('setChatEncryptedMessage', {encryptedMessage, newMessage: true, createdByMe: true});

                this.text = '';
                this.handleDeleteAttachment();

            }catch(err){
                console.error(err);
                this.error = err.message;
            }

            resolve(true);
        },

        keyUp(event){

            if (event.key === "Enter")
                return this.handleSendMessage();

        }

    }

}

</script>

<style scoped>

    .msger-inputarea {
        border-top: 2px solid #ddd;
        background: #eee;
        padding: 20px;
    }

    .fa-paperclip{
        font-size: 20px;
    }

    @media (max-width: 767px) {

        .msger-inputarea {
            padding: 10px;
        }
    }

    .file{
        display: none;
    }

</style>
