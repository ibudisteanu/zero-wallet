<template>

    <layout>

        <chat-top-bar />

        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Encrypted End to End Chat {{count}}</h1>

                <div v-for="(conversation, receiverPublicKey) in conversations"
                     :key="`conversation-router-link-${receiverPublicKey}`"
                     class="row pd-top-10 pd-bottom-10">

                        <router-link :to="`/chat/conversation/${receiverPublicKey}`" >
                            <div class="col-xs-12 col-sm-1">
                                <account-identicon class="account-identicon" :publicKey="receiverPublicKey" :size="40" :outer-size="10" />

                                <span v-if="$store.getters.conversationNewNotifications(conversation, publicKey) >= 1" class="badge badge-smaller badge-warning">{{ $store.getters.conversationNewNotifications(conversation, publicKey)  }}</span>

                            </div>
                            <div class="col-xs-12 col-sm-11">

                                <span class="address thick wordwrap">{{ getAddress(receiverPublicKey) }} </span>
                                <chat-message v-if="message(conversation)" :message="message(conversation)" :senderPublicKey="publicKey" :receiverPublicKey="receiverPublicKey" :allowWayPoint="false" />

                            </div>
                        </router-link>

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

    .account-identicon{
        max-height: 45px;
    }

    .address{
        display: inline-block;
    }

    .badge{
        position: relative;
        top: -60px;
        right: 0px;
        width: 100%;
        display: inline !important;
    }

</style>
