import Vue from 'vue';
import chat from "../../../chat/chat";

export default {

    setChatConversationsCount(context, { publicKey, count } ){

        const conversations = { ...( context.conversations[ publicKey ] || {} )  };

        conversations.count = count;

        Vue.set(context.conversations, publicKey, conversations );

    },

    setChatConversations(context, { publicKey, array, next } ){

        const conversations = { ...( context.conversations[ publicKey ] || {} )  };
        if (!conversations.list) conversations.list = {};

        for (const element of array) {
            element.count = Number.parseInt(element.count);
            conversations.list[element.receiverPublicKey] = element;
        }

        conversations.next = next;

        Vue.set(context.conversations, publicKey, conversations );

    },


    setChatConversationMessagesCount(context, { publicKey1, publicKey2, count } ){

        const publicKeys = [publicKey1, publicKey2].sort( (a,b) => a.localeCompare(b) );

        const conversationMessages = { ...( context.conversationMessages[ publicKeys[0]+":"+publicKeys[1] ] || {} )  };

        conversationMessages.count = count;

        Vue.set(context.conversationMessages, publicKeys[0]+":"+publicKeys[1], conversationMessages );

    },

    setChatConversationMessagesIds(context, { publicKey1, publicKey2, ids, next } ){

        const publicKeys = [publicKey1, publicKey2].sort( (a,b) => a.localeCompare(b) );

        const conversationMessages = { ...( context.conversationMessages[ publicKeys[0]+":"+publicKeys[1] ] || {} )  };
        if (!conversationMessages.ids) conversationMessages.ids = {};

        for (const id of ids)
            conversationMessages.ids[id] = true;

        if (next !== undefined)
            conversationMessages.next = next;

        Vue.set(context.conversationMessages, publicKeys[0]+":"+publicKeys[1], conversationMessages );

    },

    async setChatEncryptedMessage(context, { encryptedMessage, newMessage = false, createdByMe = false } ){

        const hash = encryptedMessage.hash().toString("hex");

        const publicKeys = [encryptedMessage.senderPublicKey.toString("hex"), encryptedMessage.receiverPublicKey.toString("hex")].sort( (a,b) => a.localeCompare(b) );

        const conversationMessages = { ...( context.conversationMessages[ publicKeys[0]+":"+publicKeys[1] ] || {} )  };
        if (!conversationMessages.ids) conversationMessages.ids = {};

        if (!conversationMessages.ids[ hash ]){

            conversationMessages.ids[ hash ] = true;
            conversationMessages.count = (conversationMessages.count||0) + 1;

            Vue.set(context.conversationMessages, publicKeys[0]+":"+publicKeys[1], conversationMessages );

        }

        //a new conversation
        if (newMessage) {

            const elements = [];

            for (let i = 0; i < publicKeys.length; i++) {

                const senderPublicKey = publicKeys[i];
                const receiverPublicKey = i === 0 ? publicKeys[1] : publicKeys[0];

                const conversations = {...( context.conversations[senderPublicKey] || {} )};
                if (!conversations.list) conversations.list = {};

                let notFound = false;
                if (!conversations.list[receiverPublicKey]) {
                    conversations.list[receiverPublicKey] = {};
                    notFound = true;
                }

                const element = conversations.list[receiverPublicKey];

                if (notFound) {
                    element.version = 0;
                    element.receiverPublicKey = receiverPublicKey;
                    element.count = 1;
                    element.encryptedMessage = hash;

                    if (i === 0)
                        conversations.count = (conversations.count || 0) + 1;

                } else if (element.encryptedMessage !== hash) {
                    element.count += 1;
                    element.encryptedMessage = hash;
                }

                element.update = Math.floor( new Date().getTime()/1000 );

                elements.push(element);

                Vue.set(context.conversations, publicKeys[i], conversations);

            }

            encryptedMessage.index = Math.max( elements[0].count - 1, elements[1].count -1);


        }

        try{

            const senderAddress = await PandoraPay.wallet.manager.getWalletAddressByAddress( encryptedMessage.senderAddress );
            if (senderAddress) {

                const data = await encryptedMessage.decryptData(encryptedMessage.senderEncryptedData, senderAddress.keys.decryptPrivateKey() );

                const senderData = await PandoraPay.cryptography.chatMessageValidator.validateChatMessage(data);
                if (senderData)
                    encryptedMessage._senderData = senderData;

            }

        }catch(err){

        }

        try{

            const receiverAddress = await PandoraPay.wallet.manager.getWalletAddressByAddress( encryptedMessage.receiverAddress );
            if (receiverAddress) {
                const data = await encryptedMessage.decryptData(encryptedMessage.receiverEncryptedData, receiverAddress.keys.decryptPrivateKey() );

                const receiverData = await PandoraPay.cryptography.chatMessageValidator.validateChatMessage(data);
                if (receiverData)
                    encryptedMessage._receiverData = receiverData;

            }

        }catch(err){

        }

        if (newMessage && !createdByMe && !context.messages[hash]){

            const chatMessage = (encryptedMessage._senderData ? encryptedMessage._senderData : encryptedMessage._receiverData);

            if (chatMessage && chatMessage.data.length > 0) {

                let text;
                if (chatMessage.script === 0) text = chatMessage.data; else
                if (chatMessage.script === 1) text = chatMessage.data.text;

                Vue.notify({
                    type: 'warn',
                    title: 'A new message received',
                    text: chatMessage.data.toString("ascii"),
                });
            }

        }

        Vue.set( context.messages, hash, encryptedMessage );

    },

}