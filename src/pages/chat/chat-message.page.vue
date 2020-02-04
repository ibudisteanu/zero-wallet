<template>

    <layout>

        <chat-top-bar />

        <div class="container pd-top-40">
            <div class="boxed ">

                <h2>Encrypted End-to-End Chat {{count}}</h2>
                <span class="disabled">Trader Public Key: {{receiverPublicKey}} </span>
                <account-identicon :publicKey="receiverPublicKey" size="20" outer-size="7" />

                <section class="msger">

                    <main class="msger-chat">

                        <div v-for="(value, id) in ids"
                             :class="`msg ${ messageSender(messages[id])  ? 'right' : 'left' }-msg`"
                             :key="`chat-message-${id}`">
                            <div class="msg-bubble">

                                <loading-spinner v-if="!messages[id]" />

                                <div v-else>

                                    <div class="msg-info">
                                        <div class="msg-info-name">{{ messageName( messages[id] )  }}</div>
                                        <div class="msg-info-time">{{ messageTimeAgo(messages[id] ) }}</div>
                                        <i class="fa fa-info pointer" @click="showMessageInfo(messages[id])"></i>
                                    </div>

                                    <div class="msg-text">

                                        {{ messageText(messages[id]) }}

                                    </div>

                                </div>

                            </div>
                        </div>


                    </main>

                    <span v-if="error" class="centered danger">
                        {{error}}
                    </span>

                    <chat-message-from :sender-public-key="senderPublicKey" :receiver-public-key="receiverPublicKey" />

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
import LoadingSpinner from "src/components/utils/loading-spinner";

import Utils from "src/utils/utils"

import ChatMessageFrom from "./forms/chat-message-form"

export default {

    components: { Layout, ChatTopBar, AccountIdenticon, LoadingSpinner, ChatMessageFrom },

    data(){
        return {
            receiverPublicKey: '',
            error: '',
        }
    },

    computed:{

        publicKeys(){
            const publicKeys = [this.senderPublicKey , this.receiverPublicKey];
            publicKeys.sort( (a,b) => a.localeCompare(b) );
            return publicKeys;

        },

        count(){
            return (this.$store.state.chatMessages.messagesConversation[ this.publicKeys[0] + ':'+ this.publicKeys[1] ] || {}).count
        },

        ids(){
            return (this.$store.state.chatMessages.messagesConversation[ this.publicKeys[0] + ':'+ this.publicKeys[1]] || {}).ids || {};
        },

        messages(){
            const ids = this.ids;
            const messages = {};

            for (const id in ids)
                messages[id] = this.$store.state.chatMessages.messages[id];

            return messages;
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

        messageTimeAgo(message){
            return Utils.timeSince( message.timestamp*1000 );
        },

        messageName(message){
            return message._senderData ? 'YOU' : 'TRADER';
        },

        messageText(message){
            return (message._senderData ? message._senderData : message._receiverData).toString("ascii");
        },

        messageSender(message){
            return message && message._senderData
        },

        showMessageInfo(message){
            if (message) alert( JSON.stringify( message.toJSON() ) );
        },

        async loadChat(){

            await Chat.initPromise;

            this.receiverPublicKey = this.$route.params.publicKey;

            await Chat.startDownloadChatMessages( this.senderPublicKey, this.receiverPublicKey );

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

    .msg-info i{
        font-size: 0.85em;
    }

    .msg-info-name {
        margin-right: 10px;
        font-weight: bold;
    }
    .msg-info-time {
        margin-right: 10px;
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


    .msger-chat {
        background-color: #fcfcfe;
    }


</style>
