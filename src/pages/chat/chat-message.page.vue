<template>

    <layout>

        <chat-top-bar />

        <div class="container pd-top-40">
            <div class="boxed ">

                <h2>Encrypted End-to-End Chat {{count}}</h2>
                <span class="disabled">Trader Public Key: {{destinationPublicKey}} </span>
                <account-identicon :publicKey="destinationPublicKey" size="20" outer-size="7" />

                <section class="msger">

                    <main class="msger-chat">
                        <div class="msg left-msg">
                            <div class="msg-bubble">
                                <div class="msg-info">
                                    <div class="msg-info-name">Trader</div>
                                    <div class="msg-info-time">12:45</div>
                                </div>

                                <div class="msg-text">
                                    Text
                                </div>
                            </div>
                        </div>

                        <div class="msg right-msg">
                            <div class="msg-bubble">
                                <div class="msg-info">
                                    <div class="msg-info-name">You</div>
                                    <div class="msg-info-time">12:46</div>
                                </div>

                                <div class="msg-text">
                                    Text
                                </div>
                            </div>
                        </div>
                    </main>

                    <span v-if="error" class="centered danger">
                        {{error}}
                    </span>

                    <div class="msger-inputarea">
                        <input type="text" class="msger-input" placeholder="Your message..." v-model="text">
                        <button type="submit" class="msger-send-btn" @click="handleSendMessage">Send</button>
                    </div>
                </section>


            </div>
        </div>

    </layout>

</template>

<script>

// css based on https://codepen.io/sajadhsm/pen/odaBdd

import Layout from "src/components/layout/layout"
import ChatTopBar from "./common/chat-top-bar"
import AccountIdenticon from "src/components/wallet/account/account-identicon";

import Consensus from "src/consensus/consensus"
import Chat from "src/chat/chat"

export default {

    components: { Layout, ChatTopBar, AccountIdenticon },

    data(){
        return {
            destinationPublicKey: '',
            text: '',

            error: '',
        }
    },

    computed:{

        count(){
            return this.$store.state.chatMessages.count[ this.senderPublicKey + ':'+this.destinationPublicKey]
        },

        mainAddress(){
            return this.$store.state.wallet.mainAddress;
        },

        senderPublicKey(){
            if (!this.mainAddress) return '';
            return this.$store.state.addresses.list[this.mainAddress].publicKey;
        }

    },

    methods: {

        async loadChat(){

            await Chat.initPromise;

            this.destinationPublicKey = this.$route.params.publicKey;

            await Chat.startDownloadChatMessages( this.senderPublicKey, this.destinationPublicKey );

        },

        async handleSendMessage(){

            this.error = '';

            try{

                const walletAddress = PandoraPay.wallet.manager.getWalletAddressByAddress( this.mainAddress, false, this.password );

                if (this.text.length < 1) throw {message: "Text needs at least one char"};

                const encryptedMessage = await PandoraPay.cryptography.encryptedMessageCreator.createEncryptedMessage({
                    senderPublicKey: walletAddress.decryptPublicKey(),
                    text: this.text,
                    destinationPublicKey: this.destinationPublicKey,
                });


                const outChat = await Chat._client.emitAsync("encrypted-chat/new-message", { encryptedMessage: encryptedMessage.toBuffer() }, 0);
                if (!outChat) throw {message: "Message was not included"};

                console.log("out-chat", outChat);

                this.title = '';

            }catch(err){
                this.error = err.message;
            }

        },


    },

    watch: {
        '$route' (to, from) {
            return this.loadChat();
        }
    },

    async mounted(){

        return this.loadChat();

    }

}

</script>

<style scoped>

    .msger {
        display: flex;
        flex-flow: column wrap;
        justify-content: space-between;
        width: 100%;
        margin: 25px 10px;
        height: calc(100% - 50px);
        border: 2px solid #ddd;
        border-radius: 5px;
        background: #fff;
        box-shadow: 0 15px 15px -5px rgba(0, 0, 0, 0.2);
    }

    .msger-chat {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
    }
    .msger-chat::-webkit-scrollbar {
        width: 6px;
    }
    .msger-chat::-webkit-scrollbar-track {
        background: #ddd;
    }
    .msger-chat::-webkit-scrollbar-thumb {
        background: #bdbdbd;
    }
    .msg {
        display: flex;
        align-items: flex-end;
        margin-bottom: 10px;
    }
    .msg:last-of-type {
        margin: 0;
    }
    .msg-img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        background: #ddd;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        border-radius: 50%;
    }
    .msg-bubble {
        max-width: 450px;
        padding: 15px;
        border-radius: 15px;
        background: #ececec;
    }
    .msg-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    .msg-info-name {
        margin-right: 10px;
        font-weight: bold;
    }
    .msg-info-time {
        font-size: 0.85em;
    }

    .left-msg .msg-bubble {
        border-bottom-left-radius: 0;
    }

    .right-msg {
        flex-direction: row-reverse;
    }
    .right-msg .msg-bubble {
        background: #579ffb;
        color: #fff;
        border-bottom-right-radius: 0;
    }
    .right-msg .msg-img {
        margin: 0 0 0 10px;
    }

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
    .msger-send-btn {
        margin-left: 10px;
        background: rgb(0, 196, 65);
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.23s;
    }
    .msger-send-btn:hover {
        background: rgb(0, 180, 50);
    }

    .msger-chat {
        background-color: #fcfcfe;
    }


</style>
