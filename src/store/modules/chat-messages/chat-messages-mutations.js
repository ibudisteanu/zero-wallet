import Vue from 'vue';

export default {

    setChatMessagesCount(context, { publicKey1, publicKey2, count } ){

        const publicKeys = [publicKey1, publicKey2];
        publicKeys.sort( (a,b) => a.localeCompare(b) );

        const messagesConversation = { ...( context.messagesConversation[ publicKeys[0]+":"+publicKeys[1] ] || {} )  };

        messagesConversation.count = count;

        Vue.set(context.messagesConversation, publicKeys[0]+":"+publicKeys[1], messagesConversation );

    },

    setChatMessagesIds(context, { publicKey1, publicKey2, ids, next } ){

        const publicKeys = [publicKey1, publicKey2];
        publicKeys.sort( (a,b) => a.localeCompare(b) );

        const messagesConversation = { ...( context.messagesConversation[ publicKeys[0]+":"+publicKeys[1] ] || {} )  };

        if (!messagesConversation.ids)
            messagesConversation.ids = {};

        for (const key of ids)
            messagesConversation.ids[key] = true;

        if (next !== undefined)
            messagesConversation.next = next;

        Vue.set(context.messagesConversation, publicKeys[0]+":"+publicKeys[1], messagesConversation );

    },

    async setChatMessage(context, { encryptedMessage } ){

        const senderAddress = await PandoraPay.wallet.manager.getWalletAddressByAddress( encryptedMessage.senderAddress );
        if (senderAddress) {
            const senderData = await encryptedMessage.decryptData(encryptedMessage.senderEncryptedData, senderAddress.decryptPrivateKey() );
            if (senderData)
                encryptedMessage._senderData = senderData;
        }

        const receiverAddress = await PandoraPay.wallet.manager.getWalletAddressByAddress( encryptedMessage.receiverAddress );
        if (receiverAddress) {
            const receiverData = await encryptedMessage.decryptData(encryptedMessage.receiverEncryptedData, receiverAddress.decryptPrivateKey() );
            if (receiverData)
                encryptedMessage._receiverData = receiverData;
        }

        Vue.set( context.messages, encryptedMessage.hash().toString("hex"), encryptedMessage );

    },


}