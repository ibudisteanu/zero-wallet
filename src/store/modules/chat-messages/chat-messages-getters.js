const getReadConversations = (conversation, senderPublicKey) => {

    const publicKeys = [senderPublicKey, conversation.receiverPublicKey ].sort( (a,b) => a.localeCompare(b) );

    const conversationKey = 'seenConversation:'+publicKeys[0]+':'+publicKeys[1];
    const out= Number.parseInt( localStorage.getItem(conversationKey) || '0' );

    return out;
};

export default {

    conversationNewNotifications: state => (conversation, senderPublicKey) => {

        return conversation.count - getReadConversations(conversation, senderPublicKey);

    },

    conversationsNewNotifications: (state, getters) => senderPublicKey => {

        const array = (state.conversations[senderPublicKey]||{}).array||[];

        let out = 0;
        for (const receiverPublicKey in array) {

            const conversation = array[receiverPublicKey];
            out = out + getters.conversationNewNotifications(conversation, senderPublicKey);

        }

        return out;
    }

}