const EventEmitter = require('events');

export default class BaseConsensus extends EventEmitter{

    constructor(settings = {}){

        super();

        this._data = {
            blocksInfo: {},
            blocks: {},
            blocksByHash: {},
            transactions: {},
            accounts: {},
            tokensInfo: {}
        }

        this._subscribed = {
            accounts: { }
        }

        this._promises = {
            blocks: {},
            blocksInfo: {},
            tokensInfo: {},
            transactions: {},
            accounts: {},
            subscribed: {
                accounts: { }
            },
            unsubscribed: {
                accounts: { }
            }
        }

        this._startedStatus = false;

        this._status = "offline";
        this._createSyncPromise();

    }

    _createSyncPromise(){
        this.syncPromise = new Promise( resolve => {
            this._syncPromiseResolve = resolve;
        });
    }

    async start(){
        if (this._startedStatus) return;

        await this._started();

        this._startedStatus = true;
    }

    async stop(){

        if (!this._startedStatus) return;

        await this._stopped();

        this._startedStatus = false;
    }

    async _started(){
    }

    async _stopped(){
    }

    get starting(){
        return this._starting;
    }

    set starting(newValue){
        this._starting = newValue;
    }

    get starting(){
        return Math.max(0 , this._data.end - 15);
    }

    get ending(){
        return this._data.end;
    }

    set status(newValue){

        if (newValue === this._status) return;

        if (this._status === "sync" && newValue === "offline")
            this._createSyncPromise();

        this._status = newValue;

        if (newValue === "sync")
            this._syncPromiseResolve(true);

        this.emitStatusUpdate(newValue);

    }

    get status(){
        return this._status;
    }

    emitStatusUpdate(newValue){
        this.emit('consensus/status-update',newValue);
    }

}
