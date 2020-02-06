<template>

    <div>

        <span v-if="error" class="centered danger">
            {{error}}
        </span>

        <div class="msger-inputarea">
            <input type="text" class="msger-input" placeholder="Your message..." v-model="text">
            <button type="submit" class="msger-send-btn" @click="handleSendMessage">Send</button>
        </div>

    </div>

</template>

<script>

import Chat from "src/chat/chat"

export default {

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
            const publicKeys = [ this.senderPublicKey , this.receiverPublicKey ].sort( (a,b) => a.localeCompare(b) );
            return publicKeys;

        },

    },

    methods:{

        async handleSendMessage(){

            this.error = '';

            try{

                if (this.text.length < 1) throw {message: "Text needs at least one char"};

                const encryptedMessage = await PandoraPay.cryptography.encryptedMessageCreator.createEncryptedMessage({
                    senderPublicKey: this.senderPublicKey,
                    text: this.text,
                    receiverPublicKey: this.receiverPublicKey,
                });

                const outChat = await Chat._client.emitAsync("encrypted-chat/new-message", { encryptedMessage: encryptedMessage.toBuffer() }, 0);
                if (!outChat) throw {message: "Message was not included"};

                this.$store.commit('setChatConversationMessagesCount', { publicKey1: this.publicKeys[0], publicKey2: this.publicKeys[1], count: (this.count || 0) +1 });
                this.$store.commit('setChatConversationMessagesIds', {publicKey1: this.publicKeys[0], publicKey2: this.publicKeys[1], ids: [ encryptedMessage.hash().toString("hex") ] });
                this.$store.commit('setChatEncryptedMessage', {encryptedMessage});


                this.text = '';

            }catch(err){
                console.error(err);
                this.error = err.message;
            }

        },

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




</style>
