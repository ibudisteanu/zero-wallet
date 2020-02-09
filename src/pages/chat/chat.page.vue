<template>

    <layout>

        <chat-top-bar />

        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Encrypted End to End Chat {{count}}</h1>

                <router-link v-for="(conversation, publicKey) in conversations"
                             :key="`conversation-router-link-${publicKey}`"
                             :to="`/chat/conversation/${publicKey}`">
                    <div class="user">
                        <account-identicon :publicKey="publicKey" :size="40" :outer-size="10" />
                        <div>

                            <span class="address thick wordwrap">{{ getAddress(publicKey) }} </span>
                            <span v-if="conversation.count - getReadConversations(publicKey) > 1" class="badge badge-small badge-warning">{{ conversation.count - getReadConversations(publicKey) -1 }}</span>
                            <br/>

                            <chat-message v-if="message(conversation)" :message="message(conversation)" :senderPublicKey="publicKeys(publicKey)[0]" :receiverPublicKey="publicKeys(publicKey)[1]" :allowWayPoint="false" />

                        </div>
                    </div>
                </router-link>


            </div>
        </div>

    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import ChatTopBar from "./common/chat-top-bar"
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import Utils from "src/utils/utils"
import ChatMessage from "./common/chat-message.vue"

export default {

    components: { Layout, ChatTopBar, AccountIdenticon, ChatMessage },

    data(){
        return {
            error: '',
        }
    },

    computed:{

        count(){
            return (this.$store.state.chatMessages.conversations[this.publicKey]||{}).count;
        },

        mainAddress(){
            return this.$store.state.wallet.mainAddress;
        },

        publicKey(){
            if (!this.mainAddress) return '';
            return this.$store.state.addresses.list[this.mainAddress].publicKey;
        },

        conversations(){
            return (this.$store.state.chatMessages.conversations[this.publicKey] || {}).array||{}
        }

    },


    methods: {

        message(conversation){
            const encryptedMessageId = this.conversations[conversation.receiverPublicKey].encryptedMessage;
            return this.$store.state.chatMessages.messages[encryptedMessageId];
        },

        getReadConversations(receiverPublicKey){

            const publicKeys = this.publicKeys(receiverPublicKey);

            const conversationKey = 'seenConversation:'+publicKeys[0]+':'+publicKeys[1];
            return Number.parseInt( localStorage.getItem(conversationKey) || '0' );

        },

        getAddress(publicKey){
            if (!publicKey) return '';
            const address = PandoraPay.cryptography.addressGenerator.generateAddressFromPublicKey( publicKey );
            return address ? address.calculateAddress() : '';

        },

        publicKeys(receiverPublicKey){
            return [ this.publicKey, receiverPublicKey ].sort( (a,b) => a.localeCompare(b) );

        },

    },

}

</script>

<style scoped>

    .user{

        display: grid;
        grid-template-columns: 60px 1fr;
        grid-column-gap: 5px;
    }

    .address{
        display: inline-block;
    }

</style>
