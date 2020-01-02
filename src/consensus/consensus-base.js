const EventEmitter = require('events');

export default class BaseConsensus extends EventEmitter{

    constructor(settings = {}){

        super();

        this._settings = settings;

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

    async getBlocksDetails(startingHeight, endingHeight){

    }

    async getBlock(height){

    }

    async getBlockTransactions(height){

    }

    async getTransaction(txId){

    }


    get starting(){
        return this._starting;
    }

    set starting(newValue){
        this._starting = newValue;
    }

    get ending(){
        return this._ending;
    }

    set ending(newValue){
        this._ending = newValue;
    }

    set status(newValue){

        if (newValue === this._status) return;

        if (this._status === "sync")
            this._createSyncPromise();

        this._status = newValue;

        if (newValue === "sync")
            this._syncPromiseResolve(true);

        this.emit(newValue);

        console.log("new status: ", this._status);

    }

    get status(){
        return this._status;
    }

}