<template>

    <layout>

        <chat-top-bar />

        <div class="container pd-top-40">
            <div class="boxed ">

                <h2>Encrypted End-to-End Chat {{count}}</h2>

                <div class="user">
                    <account-identicon :publicKey="receiverPublicKey" :size="40" :outer-size="10" />
                    <div>
                        <span class="thick wordwrap">{{ getAddress(receiverPublicKey) }}</span>
                        <span class="disabled wordwrap">{{ receiverPublicKey }}</span>
                    </div>
                </div>

                <section class="msger">

                    <main class="msger-chat">

                        <div v-for="(message, index) in messages"
                             :key="`chat-message-${index}`">

                            <chat-message  :message="message" :receiverPublicKey="receiverPublicKey" :senderPublicKey="senderPublicKey" />

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

import Chat from "src/chat/chat"
import LoadingSpinner from "src/components/utils/loading-spinner";

import ChatMessageFrom from "./forms/chat-message-form"
import ChatMessage from "./common/chat-message"

export default {

    components: { Layout, ChatTopBar, AccountIdenticon, LoadingSpinner, ChatMessageFrom, ChatMessage },

    data(){
        return {
            receiverPublicKey: '',
            error: '',
        }
    },

    computed:{

        publicKeys(){
            return [this.senderPublicKey , this.receiverPublicKey].sort( (a,b) => a.localeCompare(b) );

        },

        count(){
            return (this.$store.state.chatMessages.conversationMessages[ this.publicKeys[0] + ':'+ this.publicKeys[1] ] || {}).count
        },

        ids(){
            return (this.$store.state.chatMessages.conversationMessages[ this.publicKeys[0] + ':'+ this.publicKeys[1]] || {}).ids || {};
        },

        messages(){
            const ids = this.ids;
            const messages = [];

            for (const id in ids)
                messages.push( this.$store.state.chatMessages.messages[id] );

            return messages.sort( (a,b) => a.index - b.index );
        },

        mainAddress(){
            return this.$store.state.wallet.mainAddress;
        },

        senderPublicKey(){
            if (!this.mainAddress) return '';
            return this.$store.state.addresses.list[this.mainAddress].publicKey;
        },


    },

    methods: {



        getAddress(publicKey){
            if (!publicKey) return '';
            const address = PandoraPay.cryptography.addressGenerator.generateAddressFromPublicKey( publicKey );
            return address ? address.calculateAddress() : '';

        },


        async loadChat(senderPublicKey = this.senderPublicKey){

            await Chat.initPromise;

            this.receiverPublicKey = this.$route.params.publicKey;

            await Chat.downloadChatConversationMessages( senderPublicKey, this.receiverPublicKey );

        },


    },

    watch: {
        '$route' (to, from) {
            return this.loadChat();
        },

        senderPublicKey (to, from){
            console.log("senderPublicKey  changed");
            return this.loadChat(to);
        },

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


    .msger-chat {
        background-color: #fcfcfe;
    }

    .user{

        display: grid;
        grid-template-columns: 60px 1fr;
        grid-column-gap: 5px;
    }


</style>
