import BaseConsensus from "../consensus/consensus-base";
import consts from "../../consts/consts";


const {client} = global.blockchain.sockets.client;
const {BasicSocket} = global.blockchain.sockets.basic;
const {Helper} = global.kernel.helpers;

const {NodeConsensusTypeEnum} = global.blockchain.sockets.schemas.types;
const {BigNumber} = global.kernel.utils;
const {MarshalData} = global.kernel.marshal;

class Chat extends BaseConsensus{

    constructor(settings) {

        super(settings);

        this._settings.address = consts.fallbackChatServer;

        this._data = {

            accounts: {

            },

            messages:{

            },

        };


    }

    async _started(){

        const out = await PandoraPay.cryptography.cryptoSignature.testEncryptDecrypt();
        if (!out) alert('Chat encryption is not supported');

        const sock = client( this._settings.address, {

            reconnection: true,
            maxHttpBufferSize: PandoraPay._scope.argv.networkSettings.networkMaxSize,
            query: {
                handshake: JSON.stringify({
                    short: PandoraPay._scope.argv.settings.applicationShort,

                    build: PandoraPay._scope.argv.settings.buildVersion,

                    net: {
                        type: PandoraPay._scope.argv.settings.networkType,
                    },

                    address: '',
                    consensus: NodeConsensusTypeEnum.CONSENSUS_RPC
                })
            }
        });

        this._client = new BasicSocket( PandoraPay._scope, this._settings.address, sock, undefined );

        [ "connect", "disconnect"  ].map( fct => this._client[fct] = sock[fct].bind( sock ) );
        [ "emit", "on","once" ].map( fct => this._client['_'+fct] = sock[fct].bind( sock ) );

        this._client.on("connect", ()=> this.status = "online" );
        this._client.on("disconnect", ()=> this.status = "offline" );

        this._client.once("handshake", handshake =>{


            if (handshake.short === PandoraPay._scope.argv.settings.applicationShort) {
                this.status = "syncing";
                this._client.emit("ready!", "go!");
            }
            else
                this._client.close();
        });

        this._client.on("connect", ()=>{

            this._client.on('encrypted-chat/subscribe/new-message/answer', async (out) => {

                console.log("out", out);

                const encryptedMessage = await PandoraPay.cryptography.encryptedMessageValidator.validateEncryptedMessage( Buffer.from(out) );
                this._data.messages[ encryptedMessage.hash().toString("hex") ] = encryptedMessage;

                this.emit('encrypted-chat/message-downloaded', { encryptedMessage, newMessage: true });

            } );

            this.getEncryptedChatInfo();
            this._subscribeAccounts();

            this._initPromiseResolve(true);

        });

    }

    getEncryptedChatInfo(){

        if (this._client)
            return this._client.emit("encrypted-chat/get-info", undefined, this._processEncryptedChatInfo.bind(this));

    }

    setAccounts( accounts ){

        this._data.accounts = {};
        for (const account in accounts)
            this._data.accounts[account] = accounts[account];

        this._subscribeAccounts();
    }

    async _subscribeAccounts(){

        if (!this._client) return;

        for (const account in this._data.accounts){

            const publicKey = this._data.accounts[account].publicKey;

            const subscription = await this._client.emitAsync('encrypted-chat/subscribe/new-message', {publicKey}, 0 );

            const conversations = await this._client.emitAsync('encrypted-chat/conversations/content-count', {publicKey}, 0 );

            if (typeof conversations === "number") {

                this.emit('encrypted-chat/conversations-count-update', { publicKey,  count: conversations });
                await this.downloadChatConversations(publicKey, conversations);

            }
        }

    }

    async downloadChatConversations(publicKey, index){

        const limit = 20;

        const out = await this._client.emitAsync("encrypted-chat/conversations/content", {publicKey, index: Math.max(0, Math.ceil(index / limit)-1), limit , }, 0);
        if (!out) return;

        console.log("downloadChatConversations", out);

        this.emit('encrypted-chat/conversations-update', { publicKey,  array: out });

        for (const element of out ){

            const encryptedMessage = element.encryptedMessage;
            await this._downloadChatMessage(encryptedMessage, element.count-1 );

        }

    }

    async downloadChatConversationMessages(publicKeySender, publicKeyReceiver){

        const out = await this._client.emitAsync("encrypted-chat/conversation-messages/content-count", {publicKey1: publicKeySender, publicKey2: publicKeyReceiver}, 0);
        if (typeof out !== "number") return;

        this.emit('encrypted-chat/conversation-messages-count-update', {publicKey1: publicKeySender, publicKey2: publicKeyReceiver, count: out});

        if (out > 0)
            await this.downloadChatConversationMessagesSpecific(publicKeySender, publicKeyReceiver, out);


    }

    async downloadChatConversationMessagesSpecific(publicKeySender, publicKeyReceiver, index){

        const limit = 20;
        const startIndex = Math.ceil(index / limit)-1;

        const out = await this._client.emitAsync("encrypted-chat/conversation-messages/content-ids", {publicKey1: publicKeySender, publicKey2: publicKeyReceiver, index: startIndex , limit , }, 0);
        if (!out) return;

        this.emit('encrypted-chat/conversation-messages-ids-update', {publicKey1: publicKeySender, publicKey2: publicKeyReceiver, ids: out, next: Math.max(0, index - limit) });

        for (let i=0; i < out.length; i++) {
            const encryptedMessageId = out[i];
            await this._downloadChatMessage(encryptedMessageId, startIndex + i);
        }

    }

    async _downloadChatMessage(encryptedMessageId, index){

        if (this._data.messages[encryptedMessageId]) return this._data.messages[encryptedMessageId];

        const out = await this._client.emitAsync("encrypted-chat/get-message", {encryptedMessageId: encryptedMessageId}, 0);
        if (!out) return;

        const encryptedMessage = await PandoraPay.cryptography.encryptedMessageValidator.validateEncryptedMessage( Buffer.from(out) );
        encryptedMessage.index = index;

        this._data.messages[encryptedMessageId] = encryptedMessage;

        this.emit('encrypted-chat/message-downloaded', { encryptedMessage, newMessage: false });


    }

    _processEncryptedChatInfo(info){

        this.emit('encrypted-chat/chat-info-updated', info);
        this.status = "sync";

    }

    emitStatusUpdate(newValue){
        this.emit('encrypted-chat/status-update',newValue);
    }

}

export default new Chat({});