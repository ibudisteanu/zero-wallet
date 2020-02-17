<template>

    <div :class="`msg ${ messageSender  ? 'right' : 'left' }-msg`">

        <account-identicon v-if="message" class="hidden-xs msg-img" :publicKey="messageSender ? senderPublicKey : receiverPublicKey" size="40" outer-size="10" outer-color="#ececec" />

        <div class="msg-bubble">

            <loading-spinner v-if="!message || message.index === undefined" />

            <div v-else>


                <div class="msg-info">
                    <div class="msg-info-name">{{ messageName  }}</div>
                    <div class="msg-info-time">{{ messageTimeAgo }}</div>
                    <i class="fa fa-info pointer" @click="showMessageInfo"></i>
                    <span v-if="!seen" class="badge badge-smaller badge-warning">New</span>
                </div>

                <div class="msg-text">

                    {{ messageText }}

                    <chat-attachment v-if="chatMessage.script === 1" :attachment="chatMessage.data" />


                </div>

                <way-point @shown="wasShown" :distance="0" :checkVisible="true" :enabled="wayPointEnabled && allowWayPoint" />

            </div>

        </div>


    </div>

</template>

<script>

import WayPoint from "src/components/utils/waypoint.vue"
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import ChatAttachment from "./chat-attachment.vue"
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

    components: { WayPoint, AccountIdenticon, ChatAttachment, LoadingSpinner},

    data(){
        return {
            seen: true,
            wayPointEnabled: false,
        }
    },

    props: {
        message: {default: null},
        allowWayPoint: {default: true},
        receiverPublicKey: {default: ''},
        senderPublicKey: {default: ''},
    },

    computed:{

        publicKeys(){
            return [ this.senderPublicKey , this.receiverPublicKey ].sort( (a,b) => a.localeCompare(b) );
        },

        messageTimeAgo(){
            return kernel.helpers.StringHelper.timeSince( this.message.timestamp*1000 );
        },

        messageName(){
            return  this.messageSender ? 'YOU' : 'TRADER';
        },

        chatMessage(){

            return (this.message._senderData ? this.message._senderData : this.message._receiverData);

        },

        messageText(){
            const chatMessage = this.chatMessage;

            if ( !chatMessage ) return 'error';

            if (chatMessage.script === 0) return chatMessage.data.string;
            if (chatMessage.script === 1) return chatMessage.data.text;
        },

        messageSender(){
            return this.message && this.message._senderData && this.senderPublicKey === this.message.senderPublicKey.toString("hex");
        },

    },

    methods:{
        showMessageInfo(){
            if (this.message) alert( JSON.stringify( this.message.toJSON() ) );
        },

        wasShown(){

            localStorage.setItem('seenMessage:'+this.message.hash().toString("hex"), new Date().getTime() );

            const conversationKey = 'seenConversation:'+this.publicKeys[0]+':'+this.publicKeys[1];
            const prevValue = Number.parseInt( localStorage.getItem(conversationKey) || '0' );

            localStorage.setItem(conversationKey, Math.max(prevValue, this.message.index + 1) );
        },

        getSeen(){

            if (typeof window === "undefined") return;
            if (!this.message ) return;

            const seen = localStorage.getItem('seenMessage:'+this.message.hash().toString("hex") );
            if ( !seen ) this.seen = false;
            this.wayPointEnabled = true;

        }

    },

    watch:{

        message(message, oldValue){

            if (message)
                this.getSeen();


        }

    },

    mounted(){
        this.getSeen();
    }

}
</script>

<style scoped>

    .msg {
        display: flex;
        align-items: flex-end;
        margin-bottom: 10px;
    }

    .msg-img {
        margin-right: 10px;
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
        align-items: right;
        margin-bottom: 10px;
    }

    .msg-info i{
        font-size: 0.85em;
    }

    .msg-info-name {
        font-weight: bold;
    }
    .msg-info-time {
        font-size: 0.85em;
    }

    .msg-info span,
    .msg-info div,
    .msg-info i{
        margin-right: 10px;
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


</style>