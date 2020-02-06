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
                            <span class="thick">{{ getAddress(publicKey) }}</span>
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

export default {

    components: { Layout, ChatTopBar, AccountIdenticon },

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
            return (this.$store.state.chatMessages.conversations[this.publicKey] || {}).ids||{}
        }

    },


    methods: {

        getAddress(publicKey){

            const address = PandoraPay.cryptography.addressGenerator.generateAddressFromPublicKey( publicKey );
            return address ? address.calculateAddress() : '';

        }

    },

}

</script>

<style scoped>

    .user{

        display: grid;
        grid-template-columns: 60px 1fr;
        grid-column-gap: 5px;
    }

</style>
