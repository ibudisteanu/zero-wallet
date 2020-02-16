<template>

    <div>

        <span v-if="error" class="centered danger">
            {{error}}
        </span>
        <div class="msger-inputarea">

            <input type="text" class="msger-input" placeholder="Your message..." v-model="text" v-on:keyup="keyUp" >
            <loading-button @submit="handleSendMessage" icon="fa fa-paper-plane" text="Send"/>
        </div>

        <captcha-modal ref="refCaptchaModal" />

    </div>

</template>

<script>

import Chat from "src/chat/chat"
import LoadingButton from "src/components/utils/loading-button.vue"
import CaptchaModal from "src/components/utils/captcha/captcha.modal.vue"

export default {

    components: {LoadingButton, CaptchaModal},

    props:{
        senderPublicKey: {default: ''},
        receiverPublicKey: {default: ''},
    },

    data(){
        return {
            text: '',
            error: '',
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

        async handleSendMessage(resolve, captcha){

            this.error = '';

            try{

                if (this.text.length < 1) throw {message: "Text needs at least one char"};

                const encryptedMessage = await PandoraPay.cryptography.encryptedMessageCreator.createEncryptedMessage({
                    senderPublicKey: this.senderPublicKey,
                    text: this.text,
                    receiverPublicKey: this.receiverPublicKey,
                });


                console.log("encrypted-chat/new-message");

                const out = await Chat._client.emitAsync("encrypted-chat/new-message", { encryptedMessage: encryptedMessage.toBuffer(), captcha: captcha }, 0);

                console.log("out", out);

                if (!out) throw {message: "Message was not included"};

                if (out.result === false) {

                    if (out.error === "Captcha is missing") {

                        this.$refs.refCaptchaModal.showModal(this.handleSendMessage);
                        return resolve(false);
                    }

                    if ( this.$refs.refCaptchaModal.processError(out.error) !== '')
                        return resolve(false);

                } else {

                    if (captcha){
                        this.$refs.refCaptchaModal.reset();
                        this.$refs.refCaptchaModal.closeModal();
                    }

                }

                //await this.$store.commit('setChatEncryptedMessage', {encryptedMessage, newMessage: true, createdByMe: true});

                this.text = '';

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
        display: flex;
        padding: 10px;
        border-top: 2px solid #ddd;
        background: #eee;
    }
    .msger-inputarea * {
        padding: 10px;
        border: none;
        border-radius: 3px;
        font-size: 1em;
    }
    .msger-input {
        flex: 1;
        background: #ddd;
    }

    button{
        width: 75px
    }

</style>
