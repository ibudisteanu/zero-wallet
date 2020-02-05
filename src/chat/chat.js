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

        };

        this._senderPublicKey = undefined;
        this._receiverPublicKey = undefined;


    }

    async _started(){

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

            this.getEncryptedChatInfo();
            this._initPromiseResolve(true);

        });

    }

    getEncryptedChatInfo(){

        if (this._client)
            return this._client.emit("encrypted-chat/get-info", undefined, this._processEncryptedChatInfo.bind(this));

    }

    subscribeAccounts( accounts ){

        this._data.accounts = {};

        accounts.map (account => {
            this._data.accounts[account] = true;
        });

    }

    async startDownloadChatMessages( publicKeySender, publicKeyReceiver ){

        if (this._downloadChatMessagesEnabled) return;

        console.log(publicKeySender, publicKeyReceiver);
        this._senderPublicKey = publicKeySender;
        this._receiverPublicKey = publicKeyReceiver;

        this._downloadChatMessagesEnabled = true;
        return this.downloadChatMessages();
    }

    async stopDownloadChatMessages(){

        this._downloadChatMessagesEnabled = false;
    }


    async downloadChatMessages(){

        const out = await this._client.emitAsync("encrypted-chat/content-count", {publicKey1: this._senderPublicKey, publicKey2: this._receiverPublicKey}, 0);
        if (typeof out !== "number") return;

        this.emit('encrypted-chat/messages-count-update', {publicKey1: this._senderPublicKey, publicKey2: this._receiverPublicKey, count: out});

        if (out > 0){

            await this.downloadChatMessagesSpecific( out );

        }

    }

    async downloadChatMessagesSpecific(index){

        const out = await this._client.emitAsync("encrypted-chat/content-ids", {publicKey1: this._senderPublicKey, publicKey2: this._receiverPublicKey, index}, 0);
        if (!out) return;

        this.emit('encrypted-chat/messages-ids-update', {publicKey1: this._senderPublicKey, publicKey2: this._receiverPublicKey, ids: out.out, next: out.next });

        for (const encryptedMessageId of out.out)
            this._downloadChatMessage(encryptedMessageId);

    }

    async _downloadChatMessage(encryptedMessageId){

        const out = await this._client.emitAsync("encrypted-chat/get-message", {encryptedMessageId: encryptedMessageId}, 0);
        if (!out) return;

        const encryptedMessage = await PandoraPay.cryptography.encryptedMessageValidator.validateEncryptedMessage( Buffer.from(out) );

        this.emit('encrypted-chat/message-downloaded', { encryptedMessage });

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